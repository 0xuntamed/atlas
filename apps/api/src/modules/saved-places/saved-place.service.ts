import type { CreateSavedPlaceInput } from "@atlas/types";
import { ErrorCode } from "@atlas/types";
import { notFound } from "../../lib/errors";
import { savedPlaceRepository } from "./saved-place.repository";

export const savedPlaceService = {
  list(userId: string, countryCode?: string) {
    return savedPlaceRepository.listByUser(userId, countryCode);
  },

  /**
   * Saving is idempotent: re-saving the same external place returns the
   * existing record instead of erroring, so "duplicate saves" is a no-op rather
   * than a failure.
   */
  async save(userId: string, input: CreateSavedPlaceInput) {
    if (input.externalPlaceId) {
      const existing = await savedPlaceRepository.findByExternalId(
        userId,
        input.externalPlaceId,
      );
      if (existing) return { record: existing, created: false };
    }

    const record = await savedPlaceRepository.create(userId, {
      name: input.name,
      externalPlaceId: input.externalPlaceId ?? null,
      countryCode: input.countryCode ?? null,
      latitude: input.latitude ?? null,
      longitude: input.longitude ?? null,
      category: input.category ?? null,
    });
    return { record, created: true };
  },

  async remove(userId: string, id: string) {
    const existing = await savedPlaceRepository.findOwned(userId, id);
    if (!existing) {
      throw notFound(
        ErrorCode.SAVED_PLACE_NOT_FOUND,
        "Saved place could not be found",
      );
    }
    await savedPlaceRepository.delete(id);
  },
};
