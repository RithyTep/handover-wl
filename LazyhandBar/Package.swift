// swift-tools-version: 5.9
import PackageDescription

let package = Package(
    name: "LazyhandBar",
    platforms: [.macOS(.v14)],
    targets: [
        .executableTarget(
            name: "LazyhandBar",
            path: "LazyhandBar",
            exclude: ["Info.plist"],
            resources: [
                .process("Assets.xcassets"),
            ]
        ),
    ]
)
