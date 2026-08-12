import type { BusinessSeed } from "./business-schema";
const s=(id:string,name:string,family:string,budgetMinEur:number,budgetIdealEur:number,hoursPerWeekMin:number,firstRevenueWeeksTypical:number,risk:number,scalability:number,financialUpside:number,difficulty:number,core:BusinessSeed["core"],skillsCore:string[]):BusinessSeed=>({id,name,universe:"software",family,budgetMinEur,budgetIdealEur,hoursPerWeekMin,firstRevenueWeeksTypical,risk,scalability,financialUpside,difficulty,core,skillsCore});
export const softwareSeeds: BusinessSeed[]=[
s("sw_micro_saas_b2b","Micro-SaaS B2B vertical","SaaS",300,1800,15,6,55,92,92,78,[55,90,35,90,70,20,45],["full-stack/no-code","customer discovery"]),
s("sw_saas_horizontal","SaaS B2B horizontal","SaaS",1000,5000,22,10,65,96,98,88,[70,95,40,95,85,25,65],["product","engineering","sales"]),
s("sw_saas_enterprise","SaaS enterprise","SaaS",3000,12000,30,20,72,98,100,95,[95,100,35,100,95,20,100],["enterprise sales","security","engineering"]),
s("sw_saas_b2c","SaaS B2C abonnement","SaaS",500,3000,18,8,62,90,90,80,[45,90,65,80,75,75,35],["product","growth","engineering"]),
s("sw_mobile_subscription","App mobile par abonnement","Mobile",500,3000,18,8,65,92,92,82,[40,95,75,75,80,80,30],["mobile dev","product","ASO"]),
s("sw_mobile_freemium","App mobile freemium","Mobile",800,4000,20,10,70,95,95,86,[35,95,80,85,85,85,25],["mobile dev","growth","analytics"]),
s("sw_paid_app","Application payante one-shot","Mobile",250,1500,12,5,45,62,60,62,[25,85,75,55,55,55,20],["mobile dev","design"]),
s("sw_browser_extension","Extension navigateur premium","Extensions",150,800,10,4,48,78,72,60,[25,90,45,80,50,25,15],["JavaScript","browser APIs"]),
s("sw_shopify_app","Application Shopify","Extensions",300,1800,15,6,55,88,88,74,[50,95,40,90,70,20,45],["Shopify APIs","B2B support"]),
s("sw_wordpress_plugin","Plugin WordPress premium","Extensions",200,1200,12,5,48,80,78,66,[35,90,40,75,65,25,30],["PHP/WordPress","support"]),
s("sw_design_plugin","Plugin Figma / design tool","Extensions",150,1000,12,5,50,78,75,68,[25,85,85,65,55,35,20],["plugin APIs","design"]),
s("sw_api_service","API-as-a-Service","Infrastructure",500,3000,18,8,62,95,95,84,[45,100,20,100,85,10,35],["backend","API design","billing"]),
s("sw_data_service","Data-as-a-Service","Infrastructure",1500,8000,20,10,68,94,97,88,[65,95,20,100,95,10,60],["data pipelines","compliance","sales"]),
s("sw_developer_tool","Developer tool SaaS","Infrastructure",400,2500,18,8,60,92,92,82,[35,100,25,100,70,20,30],["developer experience","engineering"]),
s("sw_ai_agent_vertical","Agent IA vertical","AI software",500,3000,18,6,68,95,96,84,[65,95,45,95,80,30,60],["LLM systems","workflow design","sales"]),
s("sw_ai_wrapper_consumer","Produit IA grand public","AI software",300,1800,15,4,72,88,85,76,[30,85,80,75,65,90,25],["AI APIs","growth","UX"]),
s("sw_ai_workflow_tool","Outil workflow IA B2B","AI software",500,3500,18,7,62,94,95,82,[60,95,40,95,85,25,55],["automation","LLM","B2B discovery"]),
s("sw_marketplace","Marketplace logiciel","Platform",3000,15000,28,16,82,99,100,96,[95,95,55,100,100,45,100],["marketplace ops","engineering","growth"]),
s("sw_two_sided_service_platform","Plateforme de mise en relation services","Platform",1500,8000,25,12,75,97,98,92,[95,85,50,90,100,40,100],["marketplace","trust","growth"]),
s("sw_white_label_saas","White-label SaaS","Distribution",800,4000,18,6,52,84,86,76,[85,75,35,75,85,20,85],["sales","integration","support"]),
s("sw_reseller_saas","Revendeur / intégrateur SaaS avec revenu récurrent","Distribution",400,2000,15,2,38,72,75,60,[95,45,30,55,75,15,95],["vente B2B","implementation"]),
s("sw_open_core","Open-core software","Open source",1000,5000,25,12,70,96,98,92,[55,100,35,100,90,35,60],["open source","engineering","community"]),
s("sw_self_hosted_license","Logiciel self-hosted sous licence","Licensing",700,3500,20,8,58,86,90,82,[70,100,25,95,85,20,70],["engineering","deployment","sales"]),
s("sw_template_code","Boilerplate / starter kit code","Digital software product",100,600,10,3,35,62,58,52,[30,95,55,65,45,50,20],["code","documentation","distribution"]),
s("sw_game_indie","Jeu mobile/PC indie","Entertainment software",1000,8000,25,20,85,90,95,95,[25,95,100,75,95,85,20],["game dev","art/design","community"])
];