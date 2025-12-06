import { BarangRepository } from "../repositories/BarangRepository";

export class GetRiwayatLog {
  constructor(private repo: BarangRepository) {}

  async execute() {
    return await this.repo.getRiwayatList();
  }
}