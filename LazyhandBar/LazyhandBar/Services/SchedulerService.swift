import Foundation

final class SchedulerService: ObservableObject {
    @Published var nextFireDate: Date?
    @Published var isScheduled: Bool = false

    private var timer: DispatchSourceTimer?
    private let queue = DispatchQueue(label: "com.lazyhand.scheduler")

    var onFire: (() -> Void)?

    func schedule(hour: Int, minute: Int) {
        cancel()

        let components = DateComponents(hour: hour, minute: minute, second: 0)
        guard let nextDate = Calendar.current.nextDate(
            after: Date(),
            matching: components,
            matchingPolicy: .nextTime
        ) else {
            print("[Scheduler] Could not compute next fire date")
            return
        }

        let interval = nextDate.timeIntervalSinceNow
        guard interval > 0 else { return }

        DispatchQueue.main.async {
            self.nextFireDate = nextDate
            self.isScheduled = true
        }

        let source = DispatchSource.makeTimerSource(queue: queue)
        // Use strict timing with 0 leeway to prevent early firing
        source.schedule(
            deadline: .now() + interval,
            leeway: .seconds(0)
        )
        source.setEventHandler { [weak self] in
            guard let self else { return }
            DispatchQueue.main.async {
                self.onFire?()
                // Reschedule for next day
                self.schedule(hour: hour, minute: minute)
            }
        }
        source.resume()
        timer = source

        let formatter = DateFormatter()
        formatter.dateFormat = "HH:mm:ss, MMM d"
        print("[Scheduler] Next fire: \(formatter.string(from: nextDate)) (in \(Int(interval))s)")
    }

    func cancel() {
        timer?.cancel()
        timer = nil
        DispatchQueue.main.async {
            self.isScheduled = false
            self.nextFireDate = nil
        }
    }

    deinit {
        timer?.cancel()
    }
}
