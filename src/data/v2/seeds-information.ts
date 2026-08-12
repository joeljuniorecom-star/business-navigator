import type { BusinessSeed } from "./business-schema";
const s=(id:string,name:string,family:string,budgetMinEur:number,budgetIdealEur:number,hoursPerWeekMin:number,firstRevenueWeeksTypical:number,risk:number,scalability:number,financialUpside:number,difficulty:number,core:BusinessSeed["core"],skillsCore:string[]):BusinessSeed=>({id,name,universe:"information",family,budgetMinEur,budgetIdealEur,hoursPerWeekMin,firstRevenueWeeksTypical,risk,scalability,financialUpside,difficulty,core,skillsCore});
export const informationSeeds: BusinessSeed[]=[
s("info_course","Formation en ligne evergreen","Education",100,800,10,3,30,82,82,58,[65,15,65,45,55,70,60],["expertise","pédagogie","copywriting"]),
s("info_cohort","Cohort-based course / bootcamp","Education",300,1500,15,4,38,72,78,65,[85,20,65,55,80,55,95],["enseignement live","communauté","vente"]),
s("info_coaching_1to1","Coaching 1:1","Education",50,400,8,1,20,45,60,42,[95,5,35,45,55,15,100],["expertise","écoute","vente"]),
s("info_group_coaching","Coaching de groupe","Education",100,700,10,2,28,65,72,50,[90,10,45,50,70,35,95],["facilitation","vente","expertise"]),
s("info_consulting_productized","Conseil productisé","Expertise",100,600,10,1,22,62,72,48,[90,15,35,75,65,20,95],["expertise","diagnostic","vente"]),
s("info_paid_newsletter","Newsletter payante","Media",50,300,8,6,35,72,68,58,[30,5,55,75,65,100,25],["écriture","expertise niche","distribution"]),
s("info_free_newsletter_sponsors","Newsletter gratuite sponsorisée","Media",50,400,10,10,42,80,75,62,[55,5,60,70,70,100,40],["écriture","audience","sales sponsors"]),
s("info_youtube","Chaîne YouTube monétisée","Media",200,1500,15,20,65,88,90,78,[35,15,95,55,80,100,55],["vidéo","storytelling","patience"]),
s("info_shortform_creator","Créateur short-form","Media",50,500,12,8,62,78,78,62,[45,5,100,40,70,100,65],["short-form","créativité","personal brand"]),
s("info_podcast","Podcast monétisé","Media",200,1200,10,16,48,72,68,62,[55,10,65,45,80,85,90],["interview","audio","networking"]),
s("info_blog_affiliate","Site média SEO + affiliation","Media",100,600,10,16,45,78,70,68,[25,10,45,95,75,100,20],["SEO","écriture","affiliate"]),
s("info_comparison_site","Comparateur / review site affilié","Media",200,1000,12,12,50,82,78,72,[35,35,35,100,80,85,25],["SEO","data","affiliate"]),
s("info_digital_templates","Templates numériques","Digital product",20,250,6,2,20,68,58,42,[20,15,85,40,45,60,15],["outil métier","design","marketplace SEO"]),
s("info_spreadsheets","Modèles Excel/Notion/Sheets","Digital product",20,200,6,2,18,62,55,40,[20,20,60,70,50,50,15],["spreadsheets","documentation"]),
s("info_prompt_products","Prompts / workflows IA packagés","Digital product",20,250,6,2,35,65,58,45,[25,55,65,60,45,65,15],["prompting","workflow design"]),
s("info_ebook","E-book / guide premium","Digital product",20,250,6,3,22,58,50,42,[25,5,55,55,45,100,20],["écriture","expertise","copy"]),
s("info_paid_reports","Rapports / études premium","Research product",100,700,10,6,32,72,78,62,[45,15,35,100,75,85,45],["research","analysis","writing"]),
s("info_database","Base de données payante / intelligence de marché","Research product",300,1800,15,8,45,88,90,75,[60,70,20,100,90,45,55],["data collection","research","B2B sales"]),
s("info_job_board","Job board de niche","Marketplace media",200,1200,12,8,50,85,82,70,[80,45,35,75,85,55,85],["community","sales","distribution"]),
s("info_directory","Annuaire premium de niche","Marketplace media",100,700,10,6,38,78,72,58,[60,35,30,75,75,50,65],["curation","SEO","sales"]),
s("info_paid_community","Communauté payante","Community",100,600,10,3,30,78,75,55,[75,5,55,40,85,70,100],["community management","facilitation","content"]),
s("info_membership","Membership contenu + ressources","Community",100,700,10,4,32,82,78,58,[55,10,60,50,85,85,75],["content system","retention","community"]),
s("info_webinars","Webinaires / masterclasses payantes","Events digital",100,600,8,2,25,55,60,45,[90,10,55,45,65,70,100],["présentation","vente","expertise"]),
s("info_virtual_summit","Sommet virtuel sponsorisé","Events digital",500,2500,18,8,45,72,82,72,[95,15,70,50,95,80,100],["partenariats","production","sales"]),
s("info_asset_library","Bibliothèque d'assets créatifs premium","Digital product",100,700,10,4,28,82,75,58,[20,20,100,45,65,70,20],["design","production créative","distribution"])
];