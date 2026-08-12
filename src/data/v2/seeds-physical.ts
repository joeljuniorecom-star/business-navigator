import type { BusinessSeed } from "./business-schema";
const s=(id:string,name:string,family:string,budgetMinEur:number,budgetIdealEur:number,hoursPerWeekMin:number,firstRevenueWeeksTypical:number,risk:number,scalability:number,financialUpside:number,difficulty:number,core:BusinessSeed["core"],skillsCore:string[]):BusinessSeed=>({id,name,universe:"physical",family,budgetMinEur,budgetIdealEur,hoursPerWeekMin,firstRevenueWeeksTypical,risk,scalability,financialUpside,difficulty,core,skillsCore});
export const physicalSeeds: BusinessSeed[]=[
s("phy_cleaning","Entreprise de nettoyage","Service local",500,2500,20,1,30,58,65,50,[90,10,15,35,90,10,100],["vente locale","ops","recrutement"]),
s("phy_landscaping","Jardinage / entretien extérieur","Service local",1500,6000,20,1,38,60,68,55,[80,10,15,30,90,10,90],["service terrain","planning","vente locale"]),
s("phy_moving","Déménagement local","Service local",3000,12000,25,2,45,62,72,65,[85,10,10,35,100,5,95],["logistique","recrutement","vente locale"]),
s("phy_mobile_carwash","Lavage auto mobile","Service local",1000,5000,20,1,35,55,62,50,[80,10,15,25,85,15,85],["service terrain","local marketing"]),
s("phy_laundromat","Laverie automatique","Asset-backed",30000,120000,8,20,45,70,78,80,[20,25,10,70,75,5,35],["finance","emplacement","maintenance"]),
s("phy_vending","Distributeurs automatiques","Asset-backed",3000,15000,10,6,40,68,70,62,[45,20,10,65,85,5,60],["emplacement","réassort","négociation"]),
s("phy_fitness_studio","Studio fitness boutique","Local experience",15000,60000,35,12,55,72,82,85,[90,10,65,45,95,45,100],["coaching","vente","ops"]),
s("phy_food_truck","Food truck","Hospitality",20000,60000,40,12,68,62,75,88,[80,10,55,45,100,35,95],["cuisine","ops","hygiène"]),
s("phy_coworking","Espace coworking","Real estate service",50000,180000,30,20,65,78,88,92,[85,25,55,70,100,30,100],["immobilier","community","ops"]),
s("phy_repair_shop","Atelier réparation spécialisé","Skilled trade",3000,15000,25,2,35,55,68,58,[70,65,10,70,90,5,90],["réparation","diagnostic","service client"])
];