import { BarangRepository } from "../repositories/BarangRepository";

export class GetRiwayatLog {
  constructor(private repo: BarangRepository) {}
  async execute(page: number = 1, limit: number = 10) {
    return await this.repo.getRiwayatList(page, limit);
  }
}