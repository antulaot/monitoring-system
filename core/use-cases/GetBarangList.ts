import { BarangRepository } from "../repositories/BarangRepository";

export class GetBarangList {
  constructor(private repo: BarangRepository) {}

  async execute() {
    return await this.repo.getAll();
  }
}