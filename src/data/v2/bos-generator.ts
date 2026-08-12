import type {
  BOSGenerator,
  BOSGeneratorInput,
  BOSResult,
  BOSPhase,
  BOSConstraint,
  BOSPositioning,
  BOSIdealCustomer,
  BOSOffer,
  BOSAcquisitionChannel,
  BOSRisk,
  BOSMetric,
  BOSAction,
} from "./bos-schema";
import type { BusinessV2 } from "./business-schema";
import type { UserProfileV2, BusinessMatchV2 } from "./profile-schema";

/**
 * Derives indicative customer pricing / ticket range for an offer.
 * IMPORTANT: This represents what CUSTOMERS pay, NOT the startup cost (budget_min_eur).
 */
export function deriveOfferPricing(business: BusinessV2, profile: UserProfileV2): BOSOffer["priceRange"] {
  const univ = business.universe;
  const family = (business.family || "").toLowerCase();
  const name = (business.name || "").toLowerCase();
  const tags = (business.tags || []).map((t) => t.toLowerCase());

  const isB2B = family.includes("b2b") || name.includes("b2b") || tags.includes("b2b") || univ === "agency_services";

  if (univ === "agency_services") {
    if (name.includes("ia") || name.includes("automation") || family.includes("ai")) {
      return { min: 1500, max: 4500, currency: "EUR", isIndicative: true, period: "month" };
    }
    if (isB2B) {
      return { min: 1000, max: 3500, currency: "EUR", isIndicative: true, period: "month" };
    }
    return { min: 600, max: 2000, currency: "EUR", isIndicative: true, period: "month" };
  }

  if (univ === "software") {
    if (name.includes("micro") || family.includes("micro")) {
      return { min: 19, max: 79, currency: "EUR", isIndicative: true, period: "month" };
    }
    if (isB2B) {
      return { min: 49, max: 199, currency: "EUR", isIndicative: true, period: "month" };
    }
    return { min: 9, max: 49, currency: "EUR", isIndicative: true, period: "month" };
  }

  if (univ === "ecommerce") {
    if (name.includes("luxe") || name.includes("brand") || family.includes("brand")) {
      return { min: 79, max: 250, currency: "EUR", isIndicative: true, period: "unit" };
    }
    if (name.includes("drop") || family.includes("dropship")) {
      return { min: 25, max: 65, currency: "EUR", isIndicative: true, period: "unit" };
    }
    return { min: 35, max: 120, currency: "EUR", isIndicative: true, period: "unit" };
  }

  if (univ === "information") {
    if (name.includes("consulting") || family.includes("consulting") || name.includes("expert")) {
      return { min: 500, max: 2000, currency: "EUR", isIndicative: true, period: "one_time" };
    }
    if (name.includes("template") || name.includes("digital")) {
      return { min: 19, max: 89, currency: "EUR", isIndicative: true, period: "one_time" };
    }
    return { min: 47, max: 297, currency: "EUR", isIndicative: true, period: "one_time" };
  }

  // physical
  if (name.includes("cleaning") || name.includes("lavage")) {
    return { min: 50, max: 180, currency: "EUR", isIndicative: true, period: "unit" };
  }
  return { min: 80, max: 350, currency: "EUR", isIndicative: true, period: "unit" };
}

function buildPositioning(business: BusinessV2, profile: UserProfileV2): BOSPositioning {
  const univ = business.universe;
  if (univ === "agency_services") {
    return {
      statement: `Partenaire spécialisé en ${business.name} offrant une solution clé en main axée sur le ROI pour clients B2B.`,
      differentiation: ["Approche 100% orientée résultats mesurables", "Intervention rapide sans engagement long terme", "Processus standardisé et transparent"],
    };
  }
  if (univ === "software") {
    return {
      statement: `Solution logicielle ciblée résolvant spécifiquement le problème de ${business.name} avec une prise en main immédiate.`,
      differentiation: ["Simplicité d'utilisation sans formation complexe", "Intégration rapide au flux de travail existant", "Tarification prévisible sans frais cachés"],
    };
  }
  if (univ === "ecommerce") {
    return {
      statement: `Marque e-commerce proposant des produits sélectionnés avec soin autour de ${business.name}, centrée sur l'expérience client.`,
      differentiation: ["Qualité vérifiée et livraison rapide", "Service client réactif et garanties claires", "Offres exclusives et packs avantageux"],
    };
  }
  if (univ === "information") {
    return {
      statement: `Expertise produit basée sur une méthode concrète pour ${business.name}, transformant le savoir en résultats actionnables.`,
      differentiation: ["Méthodologie étape par étape directement applicable", "Ressources et modèles téléchargeables prêts à l'emploi", "Accompagnement pragmatique orienté pratique"],
    };
  }
  // physical
  return {
    statement: `Service physique de proximité pour ${business.name}, alliant réactivité, qualité d'exécution et suivi rigoureux.`,
    differentiation: ["Intervention locale rapide et ponctuelle", "Rapport qualité-prix transparent", "Engagement de satisfaction client garanti"],
  };
}

function buildIdealCustomer(business: BusinessV2): BOSIdealCustomer {
  const univ = business.universe;
  if (univ === "agency_services") {
    return {
      description: "TPE/PME et décideurs B2B cherchant à externaliser cette compétence pour gagner du temps et améliorer leurs performances.",
      problems: ["Manque de compétences internes spécialisées", "Surcharge de travail et besoin d'exécution rapide", "Incapacité à générer un ROI mesurable sur ce canal"],
      characteristics: ["Décideur (Fondateur, Directeur)", "Budget opérationnel déjà alloué", "Attente de résultats tangibles"],
    };
  }
  if (univ === "software") {
    return {
      description: "Utilisateurs professionnels ou équipes ayant un point de friction récurrent non résolu par les outils génériques.",
      problems: ["Tâches manuelles répétitives et chronophages", "Outils actuels trop complexes ou trop chers", "Perte d'efficacité dans la gestion quotidienne"],
      characteristics: ["Utilisateur technophile ou adepte du gain de temps", "Prêt à payer un abonnement si la valeur est prouvée", "Recherche de simplicité"],
    };
  }
  if (univ === "ecommerce") {
    return {
      description: "Acheteurs en ligne passionnés ou consommateurs recherchant une solution pratique à un besoin spécifique.",
      problems: ["Difficulté à trouver un produit fiable de qualité", "Offres génériques décevantes sur le marché", "Recherche d'une expérience d'achat fluide"],
      characteristics: ["Acheteur régulier sur mobile", "Sensible aux avis clients et démonstrations vidéo", "Attiré par une offre attrayante"],
    };
  }
  if (univ === "information") {
    return {
      description: "Personnes motivées souhaitant monter en compétences rapidement ou résoudre un problème précis sans perdre de temps.",
      problems: ["Surcharge d'informations contradictoires sur internet", "Besoin d'une feuille de route structurée et éprouvée", "Manque de méthode pour passer à l'action"],
      characteristics: ["Apprenant proactif", "Prêt à investir dans son développement", "Valorise les raccourcis stratégiques"],
    };
  }
  // physical
  return {
    description: "Particuliers ou entreprises de la zone géographique locale ayant un besoin d'intervention directe sur site.",
    problems: ["Urgence ou contrainte de temps locale", "Recherche d'un prestataire fiable de confiance", "Complexité à réaliser l'intervention soi-même"],
    characteristics: ["Ancrage dans la zone locale", "Privilégie les prestataires bien notés", "Souhaite un devis clair et rapide"],
  };
}

function buildOffer(business: BusinessV2, profile: UserProfileV2): BOSOffer {
  const univ = business.universe;
  const pricing = deriveOfferPricing(business, profile);

  if (univ === "agency_services") {
    return {
      coreOffer: `Offre de service packagée : Accompagnement clé en main sur ${business.name}.`,
      deliverables: ["Audit initial et diagnostic des besoins", "Mise en place et exécution de la prestation", "Rapport mensuel de performance et optimisations"],
      priceRange: pricing,
    };
  }
  if (univ === "software") {
    return {
      coreOffer: `Application SaaS : Solution automatisée pour ${business.name}.`,
      deliverables: ["Accès complet à la plateforme web/mobile", "Modèles et workflows prêts à l'emploi", "Support prioritaire et mises à jour continuelles"],
      priceRange: pricing,
    };
  }
  if (univ === "ecommerce") {
    return {
      coreOffer: `Gamme de produits sélectionnés pour ${business.name}.`,
      deliverables: ["Produits contrôlés et emballés avec soin", "Expédition rapide avec suivi de livraison", "Garantie satisfait ou remboursé sous 14 jours"],
      priceRange: pricing,
    };
  }
  if (univ === "information") {
    return {
      coreOffer: `Programme / Produit d'information : Méthodologie complète ${business.name}.`,
      deliverables: ["Supports de formation et guides étape par étape", "Templates, checklists et outils téléchargeables", "Accès à la communauté ou sessions de Q&R"],
      priceRange: pricing,
    };
  }
  // physical
  return {
    coreOffer: `Prestation de service physique : Intervention qualifiée pour ${business.name}.`,
    deliverables: ["Déplacement et diagnostic sur site", "Exécution complète de la prestation", "Contrôle qualité et conseils d'entretien"],
    priceRange: pricing,
  };
}

function buildAcquisitionChannels(business: BusinessV2, profile: UserProfileV2): BOSAcquisitionChannel[] {
  const univ = business.universe;
  const budget = profile.constraints.budget_eur;

  if (univ === "agency_services") {
    return [
      {
        channel: "Outreach direct (LinkedIn & Cold Email)",
        priority: 1,
        rationale: "Le canal outbound B2B le plus direct pour décrocher des RDV qualifiés sans budget pub.",
        firstAction: "Rédiger la séquence de prospection et cibler 50 décideurs sur LinkedIn.",
      },
      {
        channel: "Réseau & Recommandations",
        priority: 2,
        rationale: "Activer son réseau proche et solliciter des mises en relation ciblées.",
        firstAction: "Informer 20 contacts professionnels de son lancement d'activité.",
      },
      {
        channel: "Contenu d'autorité & Études de cas",
        priority: 3,
        rationale: "Publier des démonstrations de compétences pour crédibiliser l'offre.",
        firstAction: "Publier 2 posts d'analyse de cas concrets sur LinkedIn.",
      },
    ];
  }

  if (univ === "software") {
    return [
      {
        channel: "Communautés de Niche & Forums",
        priority: 1,
        rationale: "Rejoindre les lieux où les futurs utilisateurs expriment leur problème au quotidien.",
        firstAction: "Identifier 3 groupes (Reddit, Discord, forums) et interagir sans spam.",
      },
      {
        channel: "Lancement & Outbound ciblé",
        priority: 2,
        rationale: "Présenter le produit aux bêtas-testeurs et solliciter du feedback direct.",
        firstAction: "Contacter 30 bêtas-testeurs potentiels avec un accès privilégié.",
      },
      {
        channel: "SEO & Content Marketing",
        priority: 3,
        rationale: "Capter le trafic de recherche d'intentions sur le long terme.",
        firstAction: "Créer 2 pages d'atterrissage optimisées sur les mots-clés clés du problème.",
      },
    ];
  }

  if (univ === "ecommerce") {
    if (budget < 200) {
      return [
        {
          channel: "Création de Contenu Organique (TikTok / Reels)",
          priority: 1,
          rationale: "Générer de la visibilité sans budget pub grâce aux vidéos courtes démonstratives.",
          firstAction: "Publier 3 vidéos déballage/démonstration du produit par semaine.",
        },
        {
          channel: "Micro-influence & Gifting",
          priority: 2,
          rationale: "Envoyer des échantillons à de petits créateurs en échange de visibilité.",
          firstAction: "Contacter 10 micro-créateurs dans la niche du produit.",
        },
      ];
    }
    return [
      {
        channel: "Publicité Sociale Ciblée (Meta / TikTok Ads)",
        priority: 1,
        rationale: "Tester rapidement l'attractivité des offres avec des vidéos d'usage (UGC).",
        firstAction: "Lancer une campagne de test avec 3 créatives UGC variées.",
      },
      {
        channel: "Micro-influence & Partenariats",
        priority: 2,
        rationale: "Accroître la confiance et les preuves sociales autour de la marque.",
        firstAction: "Collaborer avec 5 micro-influenceurs de la thématique.",
      },
    ];
  }

  if (univ === "information") {
    return [
      {
        channel: "Contenu d'Autorité & Réseaux Sociaux",
        priority: 1,
        rationale: "Démontrer son expertise pour captiver l'attention de son audience cible.",
        firstAction: "Définir une ligne éditoriale et publier 3 contenus fondateurs par semaine.",
      },
      {
        channel: "Lead Magnet & Funnel Email",
        priority: 2,
        rationale: "Convertir l'attention en abonnés newsletter pour bâtir un actif durable.",
        firstAction: "Créer un guide ou template offert en échange d'une adresse email.",
      },
      {
        channel: "Partenariats & Web-conférences",
        priority: 3,
        rationale: "Co-animer des événements pour toucher les audiences de partenaires complémentaires.",
        firstAction: "Proposer 2 interventions partagées à des créateurs de la niche.",
      },
    ];
  }

  // physical
  return [
    {
      channel: "Google Business Profile & Référencement Local",
      priority: 1,
      rationale: "Capter les recherches de proximité d'utilisateurs prêtes à faire appel à un service local.",
      firstAction: "Optimiser la fiche Google Business avec photos et description détaillée.",
    },
    {
      channel: "Prospection Locale & Partenariats",
      priority: 2,
      rationale: "Faire connaître son offre auprès des acteurs économiques locaux.",
      firstAction: "Rendre visite à 15 commerces ou acteurs locaux complémentaires.",
    },
    {
      channel: "Réseau Local & Recommandations",
      priority: 3,
      rationale: "Générer du bouche-à-oreille et solliciter des avis après chaque intervention.",
      firstAction: "Proposer une offre de parrainage à ses 5 premiers clients.",
    },
  ];
}

function buildExecutionPhases(business: BusinessV2, profile: UserProfileV2): BOSPhase[] {
  const univ = business.universe;
  const availableBudget = Math.max(0, profile.constraints.budget_eur);
  const hoursPerWeek = profile.constraints.hours_per_week;
  const planBudget = (suggested: number) => Math.min(availableBudget, Math.max(0, suggested));

  // Compute realistic estimated task hours based on weekly availability
  const taskHours = (scale: number) => Math.max(2, Math.round(hoursPerWeek * scale));

  if (univ === "agency_services") {
    return [
      {
        id: "p1",
        name: "Positionnement & Offre Niche",
        objective: "Définir une offre de services ultra-spécifique pour une cible B2B précise.",
        estimatedDurationDays: 14,
        estimatedBudget: planBudget(Math.min(100, availableBudget * 0.2)),
        tasks: [
          { id: "t1", title: "Définition du secteur cible", description: "Choisir la niche B2B où l'offre apporte le plus de valeur.", priority: "critical", estimatedHours: taskHours(0.8) },
          { id: "t2", title: "Packaging de l'offre", description: "Définir les livrables précis, les délais et la grille tarifaire.", priority: "high", estimatedHours: taskHours(1.0) },
        ],
        validationCriteria: ["Offre validée auprès de 3 professionnels ou décideurs du secteur"],
      },
      {
        id: "p2",
        name: "Prospection & Outreach Direct",
        objective: "Obtenir les premiers rendez-vous de découverte sans budget publicitaire.",
        estimatedDurationDays: 21,
        estimatedBudget: planBudget(Math.min(50, availableBudget * 0.2)),
        tasks: [
          { id: "t1", title: "Fichier de prospects cibles", description: "Identifier 50 à 100 décideurs sur LinkedIn ou annuaires pro.", priority: "critical", estimatedHours: taskHours(1.0) },
          { id: "t2", title: "Campagne de messages personnalisés", description: "Envoyer des accroches directes axées sur le problème du client.", priority: "critical", estimatedHours: taskHours(1.2) },
        ],
        validationCriteria: ["Obtention de 5 rendez-vous de découverte qualifiés"],
      },
      {
        id: "p3",
        name: "Closing & Premier Client",
        objective: "Convertir les rendez-vous en contrats signés avec paiement d'acompte.",
        estimatedDurationDays: 20,
        estimatedBudget: 0,
        tasks: [
          { id: "t1", title: "Conduite des rendez-vous de vente", description: "Analyser les besoins et présenter la proposition personnalisée.", priority: "critical", estimatedHours: taskHours(0.8) },
          { id: "t2", title: "Signature du contrat", description: "Valider le contrat et encaisser l'acompte initial de 50%.", priority: "critical", estimatedHours: taskHours(0.5) },
        ],
        validationCriteria: ["Premier client signé avec acompte encaissé"],
      },
      {
        id: "p4",
        name: "Delivery & Rétention",
        objective: "Assurer la livraison irréprochable et poser les bases de la récurrence.",
        estimatedDurationDays: 30,
        estimatedBudget: 0,
        tasks: [
          { id: "t1", title: "Exécution de la prestation", description: "Réaliser le travail convenu dans le respect des délais.", priority: "critical", estimatedHours: taskHours(1.5) },
          { id: "t2", title: "Proposition de suivi récurrent", description: "Proposer un contrat d'accompagnement mensuel (retainer).", priority: "medium", estimatedHours: taskHours(0.5) },
        ],
        validationCriteria: ["Satisfaction client et conversion en contrat récurrent"],
      },
    ];
  }

  if (univ === "software") {
    return [
      {
        id: "p1",
        name: "Validation Problème & Waitlist",
        objective: "Confirmer la douleur du problème et valider l'intérêt avant de tout coder.",
        estimatedDurationDays: 14,
        estimatedBudget: planBudget(Math.min(50, availableBudget * 0.2)),
        tasks: [
          { id: "t1", title: "Entretiens utilisateurs", description: "Échanger avec 10 utilisateurs cibles sur leur méthode actuelle.", priority: "critical", estimatedHours: taskHours(0.8) },
          { id: "t2", title: "Landing page de pré-inscription", description: "Créer une page vitrine simple capturant les emails d'intérêt.", priority: "high", estimatedHours: taskHours(0.8) },
        ],
        validationCriteria: ["25 inscrits qualifiés sur la liste d'attente"],
      },
      {
        id: "p2",
        name: "Développement MVP",
        objective: "Créer la version minimale fonctionnelle centrée sur l'usage principal.",
        estimatedDurationDays: 30,
        estimatedBudget: planBudget(Math.min(100, availableBudget * 0.4)),
        tasks: [
          { id: "t1", title: "Développement de la fonction cœur", description: "Construire la fonctionnalité essentielle (no-code ou code).", priority: "critical", estimatedHours: taskHours(1.8) },
          { id: "t2", title: "Intégration du système de paiement", description: "Configurer Stripe/LemonSqueezy pour encaisser les abonnements.", priority: "high", estimatedHours: taskHours(0.5) },
        ],
        validationCriteria: ["MVP fonctionnel testé sans bug bloquant"],
      },
      {
        id: "p3",
        name: "Bêta Test & Premiers Payants",
        objective: "Faire tester le MVP et valider la transformation en abonnés payants.",
        estimatedDurationDays: 21,
        estimatedBudget: planBudget(Math.min(100, availableBudget * 0.4)),
        tasks: [
          { id: "t1", title: "Onboarding des bêta-testeurs", description: "Donner accès aux 25 inscrits et recueillir leurs retours.", priority: "critical", estimatedHours: taskHours(1.0) },
          { id: "t2", title: "Conversion en abonnements", description: "Convertir les testeurs enthousiastes en premiers clients payants.", priority: "critical", estimatedHours: taskHours(0.8) },
        ],
        validationCriteria: ["Obtention des 3 premiers abonnements payants"],
      },
    ];
  }

  if (univ === "ecommerce") {
    return [
      {
        id: "p1",
        name: "Sourcing Produit & Validation Marge",
        objective: "Valider la demande et vérifier la viabilité économique du produit.",
        estimatedDurationDays: 14,
        estimatedBudget: planBudget(Math.min(100, availableBudget * 0.3)),
        tasks: [
          { id: "t1", title: "Commande d'échantillons", description: "Tester la qualité réelle auprès de 2 fournisseurs.", priority: "critical", estimatedHours: taskHours(0.6) },
          { id: "t2", title: "Calcul de marge nette", description: "Valider une marge brute unitaire supérieure à 60%.", priority: "critical", estimatedHours: taskHours(0.5) },
        ],
        validationCriteria: ["Échantillon validé avec marge unitaire > 60%"],
      },
      {
        id: "p2",
        name: "Création Boutique & Logistique",
        objective: "Construire un site e-commerce sécurisé et prêt à enregistrer des commandes.",
        estimatedDurationDays: 15,
        estimatedBudget: planBudget(Math.min(150, availableBudget * 0.3)),
        tasks: [
          { id: "t1", title: "Configuration boutique", description: "Mettre en place la boutique (Shopify/WooCommerce) et fiches produits.", priority: "critical", estimatedHours: taskHours(1.2) },
          { id: "t2", title: "Setup des moyens de paiement", description: "Activer Stripe, PayPal et les options de livraison.", priority: "high", estimatedHours: taskHours(0.5) },
        ],
        validationCriteria: ["Boutique opérationnelle et commande de test validée"],
      },
      {
        id: "p3",
        name: "Acquisition & Premières Ventes",
        objective: "Activer les canaux d'acquisition et générer le premier flux de commandes.",
        estimatedDurationDays: 30,
        estimatedBudget: planBudget(Math.min(300, availableBudget * 0.4)),
        tasks: [
          { id: "t1", title: "Production des créatives visuelles", description: "Créer des vidéos de démonstration et visuels engageants.", priority: "critical", estimatedHours: taskHours(1.0) },
          { id: "t2", title: "Lancement des campagnes d'acquisition", description: "Diffuser le contenu via canaux sociaux (organiques ou ads).", priority: "critical", estimatedHours: taskHours(1.0) },
        ],
        validationCriteria: ["10 premières commandes enregistrées et livrées"],
      },
    ];
  }

  if (univ === "information") {
    return [
      {
        id: "p1",
        name: "Clarté d'Expertise & Lead Magnet",
        objective: "Formaliser la proposition de valeur et capturer les premiers abonnés cibles.",
        estimatedDurationDays: 14,
        estimatedBudget: planBudget(Math.min(50, availableBudget * 0.2)),
        tasks: [
          { id: "t1", title: "Création d'un contenu offert", description: "Rédiger un guide, checklist ou template résolvant un problème précis.", priority: "critical", estimatedHours: taskHours(1.0) },
          { id: "t2", title: "Page de capture d'emails", description: "Mettre en place la page d'inscription et la séquence de bienvenu.", priority: "high", estimatedHours: taskHours(0.6) },
        ],
        validationCriteria: ["50 inscrits qualifiés sur la liste email"],
      },
      {
        id: "p2",
        name: "Conception & Pré-vente du Produit",
        objective: "Créer le produit d'information et valider l'acte d'achat via une pré-vente.",
        estimatedDurationDays: 21,
        estimatedBudget: planBudget(Math.min(50, availableBudget * 0.2)),
        tasks: [
          { id: "t1", title: "Structure du programme / guide", description: "Construire le plan détaillé et les modules du produit.", priority: "critical", estimatedHours: taskHours(1.2) },
          { id: "t2", title: "Campagne de pré-vente email", description: "Proposer le produit en tarif fondateur auprès de la liste.", priority: "critical", estimatedHours: taskHours(0.8) },
        ],
        validationCriteria: ["5 ventes enregistrées lors de la pré-vente"],
      },
      {
        id: "p3",
        name: "Lancement & Automatisation",
        objective: "Finaliser la livraison du produit et automatiser le système d'acquisition.",
        estimatedDurationDays: 30,
        estimatedBudget: planBudget(Math.min(100, availableBudget * 0.6)),
        tasks: [
          { id: "t1", title: "Finalisation des contenus", description: "Enregistrer ou rédiger l'ensemble des modules promis.", priority: "critical", estimatedHours: taskHours(1.5) },
          { id: "t2", title: "Automatisation du tunnel de vente", description: "Connecter la séquence email de vente automatique.", priority: "medium", estimatedHours: taskHours(0.8) },
        ],
        validationCriteria: ["Produit intégralement livré et tunnel automatique actif"],
      },
    ];
  }

  // physical
  return [
    {
      id: "p1",
      name: "Analyse de Zone & Conformité",
      objective: "Définir la zone d'intervention et s'assurer des conditions opérationnelles.",
      estimatedDurationDays: 14,
      estimatedBudget: planBudget(Math.min(100, availableBudget * 0.3)),
      tasks: [
        { id: "t1", title: "Étude de la zone locale", description: "Identifier les villes/quartiers cibles et vérifier la concurrence.", priority: "critical", estimatedHours: taskHours(0.6) },
        { id: "t2", title: "Validation réglementaire & matériel", description: "S'assurer des assurances, diplômes requis et équipement de base.", priority: "critical", estimatedHours: taskHours(0.8) },
      ],
      validationCriteria: ["Conformité juridique et équipement de départ opérationnel"],
    },
    {
      id: "p2",
      name: "Ancrage Local & Présence Web",
      objective: "Rendre le service visible auprès de la clientèle locale.",
      estimatedDurationDays: 15,
      estimatedBudget: planBudget(Math.min(100, availableBudget * 0.3)),
      tasks: [
        { id: "t1", title: "Fiche Google Business Profile", description: "Créer et optimiser la fiche d'établissement locale.", priority: "critical", estimatedHours: taskHours(0.5) },
        { id: "t2", title: "Supports de présentation locaux", description: "Préparer devis type, cartes et flyers de présentation.", priority: "high", estimatedHours: taskHours(0.8) },
      ],
      validationCriteria: ["Fiche Google validée et supports d'intervention prêts"],
    },
    {
      id: "p3",
      name: "Prospection Locale & Premières Prestations",
      objective: "Réaliser les premières interventions physiques et valider la satisfaction.",
      estimatedDurationDays: 30,
      estimatedBudget: planBudget(Math.min(150, availableBudget * 0.4)),
      tasks: [
        { id: "t1", title: "Demandes de devis & prospection", description: "Démarcher les prescripteurs locaux et répondre aux demandes.", priority: "critical", estimatedHours: taskHours(1.2) },
        { id: "t2", title: "Exécution et collecte d'avis", description: "Réaliser le service sur site et demander un avis Google immédiat.", priority: "critical", estimatedHours: taskHours(1.5) },
      ],
      validationCriteria: ["3 premières prestations réalisées avec avis 5 étoiles"],
    },
  ];
}

function buildMetrics(business: BusinessV2): BOSMetric[] {
  const univ = business.universe;
  if (univ === "agency_services") {
    return [
      { id: "me1", name: "Prospects contactés / semaine", target: "30", reason: "Assurer un volume de prospection outbound suffisant." },
      { id: "me2", name: "Taux d'obtention de RDV", target: "10%", reason: "Mesurer la pertinence de la proposition de valeur." },
      { id: "me3", name: "Panier / Retainer moyen", target: "1 200 €", reason: "Garantir la rentabilité de chaque client." },
    ];
  }
  if (univ === "software") {
    return [
      { id: "me1", name: "Inscrits liste d'attente", target: "50", reason: "Valider l'intérêt initial avant lancement." },
      { id: "me2", name: "Taux d'activation (actifs)", target: "40%", reason: "Vérifier que les utilisateurs tirent de la valeur du produit." },
      { id: "me3", name: "MRR (Revenu mensuel récurrent)", target: "300 €", reason: "Atteindre le premier palier de viabilité financière." },
    ];
  }
  if (univ === "ecommerce") {
    return [
      { id: "me1", name: "Marge brute unitaire", target: "> 60%", reason: "Sécuriser la rentabilité avant coûts d'acquisition." },
      { id: "me2", name: "Taux de conversion boutique (CVR)", target: "2.5%", reason: "Garantir l'efficacité de la page de vente." },
      { id: "me3", name: "Valeur moyenne de commande (AOV)", target: "55 €", reason: "Optimiser le chiffre d'affaires par panier." },
    ];
  }
  if (univ === "information") {
    return [
      { id: "me1", name: "Abonnés liste email", target: "100", reason: "Constituer l'actif principal pour les pré-ventes." },
      { id: "me2", name: "Taux de conversion Lead Magnet", target: "35%", reason: "Maximiser la transformation de visiteurs en abonnés." },
      { id: "me3", name: "Revenu par abonné (RPV)", target: "5 €", reason: "Mesurer la valeur générée par la liste d'audience." },
    ];
  }
  // physical
  return [
    { id: "me1", name: "Demandes de devis locaux / semaine", target: "5", reason: "Maintenir le flux d'opportunités sur la zone." },
    { id: "me2", name: "Taux de conversion Devis -> Client", target: "40%", reason: "Valider la compétitivité et la confiance du devis." },
    { id: "me3", name: "Avis Google 5 étoiles accumulés", target: "10", reason: "Renforcer la réputation de proximité." },
  ];
}

function buildMilestones(business: BusinessV2, profile: UserProfileV2): BOSResult["milestones"] {
  const weeks = business.economics.first_revenue_weeks_typical;
  const maxWeeks = profile.constraints.max_weeks_to_first_revenue;
  const targetRevenueDay = Math.min(maxWeeks * 7, weeks * 7);

  return [
    { id: "m1", name: "Validation initiale de l'offre", target: "Jour 14" },
    { id: "m2", name: "Premier prospect ou utilisateur engagé", target: "Jour 30" },
    { id: "m3", name: "Premier revenu encaissé", target: `Jour ${targetRevenueDay}` },
  ];
}

function buildRisks(business: BusinessV2, match: BusinessMatchV2): BOSRisk[] {
  const risks: BOSRisk[] = [
    { id: "r1", risk: "Délai de premier revenu plus long que prévu", severity: "medium", mitigation: "Tester la pré-vente ou l'acompte avant de finaliser la totalité du livrable." },
    { id: "r2", risk: "Dispersion dans les tâches annexes sans impact direct", severity: "low", mitigation: "Prioriser l'action quotidienne directement liée à l'acquisition." },
  ];

  // Incorporate match.attention if available
  if (match.attention && match.attention.length > 0) {
    match.attention.forEach((item, index) => {
      risks.push({
        id: `r_att_${index + 3}`,
        risk: `Point d'attention profil : ${item}`,
        severity: "high",
        mitigation: "Ajuster la vitesse d'exécution et s'appuyer sur un accompagnement ou des modèles simplifiés.",
      });
    });
  }

  return risks;
}

function buildNextActions(business: BusinessV2): BOSAction[] {
  const univ = business.universe;
  if (univ === "agency_services") {
    return [
      { id: "a1", title: "Formaliser la proposition de valeur B2B", description: "Rédiger l'offre en 3 puces claires axées sur le bénéfice client.", priority: 1 },
      { id: "a2", title: "Lister 20 prospects prioritaires", description: "Identifier 20 décideurs cibles sur LinkedIn.", priority: 2 },
    ];
  }
  if (univ === "software") {
    return [
      { id: "a1", title: "Lancer la landing page minimale", description: "Créer une page capturant les emails pour valider l'attente.", priority: 1 },
      { id: "a2", title: "Mener 3 interviews d'utilisateurs", description: "Confirmer la douleur exacte avec 3 prospects cibles.", priority: 2 },
    ];
  }
  if (univ === "ecommerce") {
    return [
      { id: "a1", title: "Commander 2 échantillons", description: "Tester la qualité physique et le délai de livraison du produit.", priority: 1 },
      { id: "a2", title: "Calculer la marge unitaire nette", description: "Valider que le prix de vente couvre au moins 3x le coût produit.", priority: 2 },
    ];
  }
  if (univ === "information") {
    return [
      { id: "a1", title: "Définir le sujet du Lead Magnet", description: "Identifier la ressource gratuite la plus attractive pour la cible.", priority: 1 },
      { id: "a2", title: "Rédiger la structure du produit", description: "Découper le savoir en 4 modules actionnables.", priority: 2 },
    ];
  }
  // physical
  return [
    { id: "a1", title: "Créer la fiche Google Business", description: "Renseigner l'adresse, la zone et les prestations proposées.", priority: 1 },
    { id: "a2", title: "Établir la grille tarifaire d'intervention", description: "Fixer les prix au forfait ou à l'heure d'intervention.", priority: 2 },
  ];
}

export function generateDeterministicBOS(input: BOSGeneratorInput): BOSResult {
  const { profile, business, match } = input;
  const univ = business.universe;

  // Build universe-specific elements
  const positioning = buildPositioning(business, profile);
  const idealCustomer = buildIdealCustomer(business);
  const offer = buildOffer(business, profile);
  const acquisitionChannels = buildAcquisitionChannels(business, profile);
  const executionPlan = buildExecutionPhases(business, profile);
  const metrics = buildMetrics(business);
  const milestones = buildMilestones(business, profile);
  const risks = buildRisks(business, match);
  const nextActions = buildNextActions(business);

  // Constraints check and warnings
  const mainConstraints: BOSConstraint[] = [
    {
      id: "c1",
      label: "Budget initial",
      severity: profile.constraints.budget_eur < business.economics.budget_min_eur ? "high" : "low",
      explanation: profile.constraints.budget_eur < business.economics.budget_min_eur
        ? `Recommandé : ${business.economics.budget_min_eur} €. Votre disponible : ${profile.constraints.budget_eur} €. Le plan est adapté en stratégie lean (organique).`
        : `Recommandé : ${business.economics.budget_min_eur} €. Votre disponible : ${profile.constraints.budget_eur} € (suffisant).`,
    },
    {
      id: "c2",
      label: "Temps hebdomadaire",
      severity: profile.constraints.hours_per_week < business.economics.hours_per_week_min ? "medium" : "low",
      explanation: profile.constraints.hours_per_week < business.economics.hours_per_week_min
        ? `Recommandé : ${business.economics.hours_per_week_min}h/semaine. Votre temps : ${profile.constraints.hours_per_week}h/semaine. Le rythme des phases sera étalé dans le temps.`
        : `Recommandé : ${business.economics.hours_per_week_min}h/semaine. Votre temps : ${profile.constraints.hours_per_week}h/semaine (aligné).`,
    },
  ];

  // Incorporate match strengths and score in summary and whyThisFits
  const whyThisFits = match.strengths && match.strengths.length > 0
    ? match.strengths
    : [
        `Score de compatibilité globale de ${match.score}% avec votre profil.`,
        `Excellente adéquation avec votre objectif de ${profile.goals.priority}.`,
        `Compatible avec vos compétences actuelles et votre style de travail.`,
      ];

  const monetization = {
    model: univ === "software"
      ? "Abonnement SaaS récurrent (MRR)"
      : univ === "agency_services"
        ? "Prestation forfaitaire + Retainer mensuel"
        : univ === "information"
          ? "Vente de produits digitaux / Formations / Accompagnement"
          : univ === "ecommerce"
            ? "Vente directe de produits avec marge unitaire élevée (>60%)"
            : "Service physique au forfait ou devis d'intervention",
    strategy: univ === "software"
      ? "Maximiser la rétention des abonnés et réduire le taux d'annulation (churn)."
      : univ === "agency_services"
        ? "Fidéliser les clients en contrats mensuels récurrents après la première prestation."
        : univ === "information"
          ? "Développer une liste d'abonnés qualifiés et proposer des offres complémentaires."
          : univ === "ecommerce"
            ? "Maximiser le panier moyen (AOV) et encourager le réachat régulier."
            : "Optimiser la densité géographique et la répétition des interventions locales.",
  };

  const launchStrategy = `Lancement lean calibré sur ${profile.constraints.hours_per_week}h/semaine et un budget disponible de ${profile.constraints.budget_eur} €. Première étape sous ${business.economics.first_revenue_weeks_typical} semaines.`;

  return {
    businessId: business.id,
    businessName: business.name,
    summary: `Plan d'exécution personnalisé pour ${business.name}, calibré pour un budget de ${profile.constraints.budget_eur} € et une disponibilité de ${profile.constraints.hours_per_week}h/semaine. Score de compatibilité : ${match.score}%.`,
    whyThisFits,
    mainConstraints,
    positioning,
    idealCustomer,
    offer,
    acquisitionChannels,
    monetization,
    launchStrategy,
    executionPlan,
    milestones,
    risks,
    metrics,
    nextActions,
  };
}

export class DeterministicBOSGenerator implements BOSGenerator {
  generate(input: BOSGeneratorInput): BOSResult {
    return generateDeterministicBOS(input);
  }
}
