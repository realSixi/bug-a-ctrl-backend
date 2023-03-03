class StatusService {

  private enabled = false;


  public setEnabled(enabled: boolean) {
    this.enabled = enabled;
  }

  public isEnabled() {
    return this.enabled;
  }


}

const statusService = new StatusService();

export default statusService;
