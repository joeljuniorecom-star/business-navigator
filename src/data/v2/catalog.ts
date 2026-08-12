import { buildBusiness } from "./build-business";
import { ecommerceSeeds } from "./seeds-ecommerce";
import { agencyServiceSeeds } from "./seeds-agency-services";
import { softwareSeeds } from "./seeds-software";
import { informationSeeds } from "./seeds-information";
import { physicalSeeds } from "./seeds-physical";

export const catalogueSeeds = [...ecommerceSeeds, ...agencyServiceSeeds, ...softwareSeeds, ...informationSeeds, ...physicalSeeds];
export const businessesV2 = catalogueSeeds.map(buildBusiness);
export const BUSINESS_COUNTS = { ecommerce: ecommerceSeeds.length, agency_services: agencyServiceSeeds.length, software: softwareSeeds.length, information: informationSeeds.length, physical: physicalSeeds.length, total: catalogueSeeds.length } as const;
