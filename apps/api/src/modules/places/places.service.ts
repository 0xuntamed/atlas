import type { DiscoveredPlaceDTO } from "@atlas/types";
import {
  getPlacesProvider,
  type PlacesProvider,
} from "../../providers/places";
import type { PlacesSearchParams } from "../../providers/places/places.provider";

export const placesService = {
  provider(): PlacesProvider {
    return getPlacesProvider();
  },

  search(params: PlacesSearchParams): Promise<DiscoveredPlaceDTO[]> {
    return getPlacesProvider().search(params);
  },
};
