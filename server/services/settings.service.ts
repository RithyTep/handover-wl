import { SettingsRepository } from "@/server/repository/settings.repository";

export class SettingsService {
  private repository: SettingsRepository;

  constructor() {
    this.repository = new SettingsRepository();
  }

  async getSchedulerEnabled(): Promise<boolean> {
    return this.repository.getSchedulerEnabled();
  }

  async setSchedulerEnabled(enabled: boolean): Promise<void> {
    await this.repository.setSchedulerEnabled(enabled);
  }

  async getTriggerTimes(): Promise<{ time1: string; time2: string }> {
    return this.repository.getTriggerTimes();
  }

  async setTriggerTimes(time1: string, time2: string): Promise<void> {
    await this.repository.setTriggerTimes(time1, time2);
  }

  async getCustomChannelId(): Promise<string | null> {
    return this.repository.getCustomChannelId();
  }

  async setCustomChannelId(value: string): Promise<void> {
    await this.repository.setCustomChannelId(value);
  }

  async getMemberMentions(): Promise<string | null> {
    return this.repository.getMemberMentions();
  }

  async setMemberMentions(value: string): Promise<void> {
    await this.repository.setMemberMentions(value);
  }

  async getEveningUserToken(): Promise<string | null> {
    return this.repository.getEveningUserToken();
  }

  async setEveningUserToken(value: string): Promise<void> {
    await this.repository.setEveningUserToken(value);
  }

  async getNightUserToken(): Promise<string | null> {
    return this.repository.getNightUserToken();
  }

  async setNightUserToken(value: string): Promise<void> {
    await this.repository.setNightUserToken(value);
  }

  async getEveningMentions(): Promise<string | null> {
    return this.repository.getEveningMentions();
  }

  async setEveningMentions(value: string): Promise<void> {
    await this.repository.setEveningMentions(value);
  }

  async getNightMentions(): Promise<string | null> {
    return this.repository.getNightMentions();
  }

  async setNightMentions(value: string): Promise<void> {
    await this.repository.setNightMentions(value);
  }
}
