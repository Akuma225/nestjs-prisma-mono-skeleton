import { Injectable } from '@nestjs/common';

@Injectable()
export class SlugService {
  /**
   * Converts a given text to a URL-friendly slug.
   *
   * This method normalizes the text by removing diacritics, converting it to lowercase,
   * trimming whitespace, replacing spaces with hyphens, and removing non-word characters.
   *
   * @param text - The text to convert to a slug.
   * @returns The generated slug.
   */
  slugify(text: string): string {
    return text
      .toString()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/[^\w-]+/g, '') // Remove non-word characters
      .replace(/--+/g, '-'); // Replace multiple hyphens with a single hyphen
  }
}
