import { CoingeckoService } from "./coingeckoService";

export class PriceController {
  private coingeckoService: CoingeckoService;

  constructor() {
    this.coingeckoService = new CoingeckoService();
  }

  async load(): Promise<void> {
    await this.coingeckoService.load();
  }

  async getPrice(symbol: string): Promise<number> {
    return this.coingeckoService.getPrice(symbol);
  }
}
