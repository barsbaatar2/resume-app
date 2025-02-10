export class RequestContextService {
  private static request: any;

  setRequest(req: any) {
    RequestContextService.request = req;
  }

  static getRequest() {
    return RequestContextService.request;
  }
}
