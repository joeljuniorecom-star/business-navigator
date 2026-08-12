import type { BOSGenerator, BOSGeneratorInput, BOSResult, BOSPhase } from "./bos-schema";

export function generateDeterministicBOS(input: BOSGeneratorInput): BOSResult {
  const { profile, business, match } = input;
  const univ = business.universe;
  const availableBudget = Math.max(0, profile.constraints.budget_eur);
  const planBudget = (suggested: number) => Math.min(availableBudget, Math.max(0, suggested));

  // Adapt execution phases based on universe
  let phases: BOSPhase[] = [];

  if (univ === "agency_services") {
    phases = [
      {
        id: "p1",
        name: "Positionnement & Offre",
        objective: "Définir une offre de services claire et ultra-spécifique pour une cible B2B précise.",
        estimatedDurationDays: 14,
        estimatedBudget: planBudget(business.economics.budget_min_eur),
        tasks: [
          { id: "t1", title: "Définition de la niche", description: "Identifier le secteur cible exact où l'expertise est valorisable.", priority: "critical", estimatedHours: 10 },
          { id: "t2", title: "Packaging de l'offre", description: "Créer une offre packagée avec livrables et prix clairs.", priority: "high", estimatedHours: 15 },
        ],
        validationCriteria: ["Offre validée par 3 retours de professionnels cibles"],
      },
      {
        id: "p2",
        name: "Prospection & Outreach",
        objective: "Générer les premiers rendez-vous clients qualifiés sans budget publicitaire massif.",
        estimatedDurationDays: 21,
        estimatedBudget: planBudget(50),
        tasks: [
          { id: "t1", title: "Construction du fichier prospects", description: "Identifier 100 décideurs cibles sur LinkedIn ou via bases pro.", priority: "critical", estimatedHours: 10 },
          { id: "t2", title: "Campagne d'approche directe", description: "Envoyer des messages personnalisés axés sur la résolution de leur problème principal.", priority: "critical", estimatedHours: 15 },
        ],
        validationCriteria: ["Obtention de 5 rendez-vous de découverte"],
      },
      {
        id: "p3",
        name: "Closing & Premier Client",
        objective: "Transformer les rendez-vous en premiers contrats payants avec acompte.",
        estimatedDurationDays: 20,
        estimatedBudget: 0,
        tasks: [
          { id: "t1", title: "Conduite des entretiens de vente", description: "Écoute active des besoins et proposition de l'offre adaptée.", priority: "critical", estimatedHours: 10 },
          { id: "t2", title: "Signature et acompte", description: "Sécuriser un contrat signé avec 50% d'acompte avant démarrage.", priority: "critical", estimatedHours: 5 },
        ],
        validationCriteria: ["1er client signé avec encaissement d'acompte"],
      },
      {
        id: "p4",
        name: "Delivery & Structuration",
        objective: "Délivrer une prestation irréprochable et poser les bases de la récurrence.",
        estimatedDurationDays: 30,
        estimatedBudget: 0,
        tasks: [
          { id: "t1", title: "Exécution de la prestation", description: "Livrer la valeur promise dans les délais impartis.", priority: "critical", estimatedHours: profile.constraints.hours_per_week * 4 },
          { id: "t2", title: "Mise en place de retainer", description: "Proposer un abonnement mensuel de suivi post-prestation.", priority: "medium", estimatedHours: 5 },
        ],
        validationCriteria: ["Client satisfait et conversion en contrat récurrent"],
      },
    ];
  } else if (univ === "software") {
    phases = [
      {
        id: "p1",
        name: "Validation du Problème",
        objective: "Confirmer que le problème résolu par le micro-SaaS est douloureux et urgent.",
        estimatedDurationDays: 14,
        estimatedBudget: planBudget(50),
        tasks: [
          { id: "t1", title: "Interviews utilisateurs", description: "Discuter avec 10 utilisateurs potentiels de leurs frustrations actuelles.", priority: "critical", estimatedHours: 10 },
          { id: "t2", title: "Landing page de pré-validation", description: "Créer une page simple capturant des emails d'intérêt.", priority: "high", estimatedHours: 8 },
        ],
        validationCriteria: ["Obtention de 25 inscrits qualifiés en liste d'attente"],
      },
      {
        id: "p2",
        name: "MVP & Développement",
        objective: "Construire la version minimale viable (MVP) résolvant une seule fonction clé.",
        estimatedDurationDays: 30,
        estimatedBudget: planBudget(business.economics.budget_min_eur),
        tasks: [
          { id: "t1", title: "Développement des fonctionnalités cœur", description: "Coder ou assembler le produit via no-code/code.", priority: "critical", estimatedHours: profile.constraints.hours_per_week * 3 },
          { id: "t2", title: "Intégration paiements", description: "Connecter Stripe pour l'encaissement des abonnements.", priority: "high", estimatedHours: 5 },
        ],
        validationCriteria: ["MVP fonctionnel testé de bout en bout"],
      },
      {
        id: "p3",
        name: "Lancement & Premiers Utilisateurs",
        objective: "Lancer le produit auprès des premiers testeurs et valider la disposition à payer.",
        estimatedDurationDays: 21,
        estimatedBudget: planBudget(100),
        tasks: [
          { id: "t1", title: "Post sur plateformes de lancement", description: "Diffuser sur Product Hunt, communautés de makers et réseaux.", priority: "critical", estimatedHours: 10 },
          { id: "t2", title: "Onboarding des bêta-testeurs", description: "Accompagner les premiers utilisateurs et corriger les bugs.", priority: "critical", estimatedHours: 15 },
        ],
        validationCriteria: ["10 premiers utilisateurs actifs et 3 abonnements payants"],
      },
    ];
  } else if (univ === "ecommerce") {
    phases = [
      {
        id: "p1",
        name: "Sourcing & Analyse Marché",
        objective: "Valider la demande et identifier un produit différenciant à forte marge.",
        estimatedDurationDays: 20,
        estimatedBudget: planBudget(100),
        tasks: [
          { id: "t1", title: "Étude concurrentielle", description: "Analyser les meilleures ventes et lacunes des concurrents.", priority: "high", estimatedHours: 10 },
          { id: "t2", title: "Échantillonnage fournisseurs", description: "Commander 2 ou 3 échantillons pour tester la qualité réelle.", priority: "critical", estimatedHours: 10 },
        ],
        validationCriteria: ["Échantillon validé et marge unitaire > 60%"],
      },
      {
        id: "p2",
        name: "Création de la Boutique",
        objective: "Mettre en place une boutique e-commerce professionnelle et rassurante.",
        estimatedDurationDays: 15,
        estimatedBudget: planBudget(200),
        tasks: [
          { id: "t1", title: "Design Shopify / Boutique", description: "Configurer le thème, les pages légales et les visuels produits.", priority: "critical", estimatedHours: 20 },
          { id: "t2", title: "Setup paiements et logistique", description: "Connecter les solutions de paiement et organiser l'expédition.", priority: "critical", estimatedHours: 10 },
        ],
        validationCriteria: ["Boutique prête et test de commande validé"],
      },
      {
        id: "p3",
        name: "Acquisition & Premières Ventes",
        objective: "Lancer les campagnes d'acquisition et générer les premières commandes.",
        estimatedDurationDays: 30,
        estimatedBudget: planBudget(Math.max(300, business.economics.budget_min_eur)),
        tasks: [
          { id: "t1", title: "Création des créatives publicitaires", description: "Produire des visuels et vidéos UGC pour Meta/TikTok.", priority: "critical", estimatedHours: 15 },
          { id: "t2", title: "Lancement des campagnes tests", description: "Tester de petits budgets publicitaires pour identifier les angles gagnants.", priority: "critical", estimatedHours: 10 },
        ],
        validationCriteria: ["10 premières ventes rentables générées"],
      },
    ];
  } else {
    // Default phases (Information, Physical, etc.)
    phases = [
      {
        id: "p1",
        name: "Validation & Conception",
        objective: "Valider l'adéquation offre/marché et structurer les fondations du projet.",
        estimatedDurationDays: 20,
        estimatedBudget: planBudget(business.economics.budget_min_eur),
        tasks: [
          { id: "t1", title: "Étude de faisabilité", description: "Vérifier les aspects réglementaires et opérationnels.", priority: "critical", estimatedHours: 10 },
          { id: "t2", title: "Conception du produit ou service", description: "Créer le prototype ou le programme initial.", priority: "critical", estimatedHours: 20 },
        ],
        validationCriteria: ["Cahier des charges et prototype validés"],
      },
      {
        id: "p2",
        name: "Lancement & Commercialisation",
        objective: "Mettre sur le marché et réaliser les premières ventes.",
        estimatedDurationDays: 30,
        estimatedBudget: planBudget(200),
        tasks: [
          { id: "t1", title: "Mise en visibilité", description: "Activer les canaux de communication cibles.", priority: "critical", estimatedHours: 15 },
          { id: "t2", title: "Conversion des premiers clients", description: "Accompagner les premiers acheteurs.", priority: "critical", estimatedHours: 15 },
        ],
        validationCriteria: ["Premiers revenus encaissés"],
      },
    ];
  }

  return {
    businessId: business.id,
    businessName: business.name,
    summary: `Plan d'exécution personnalisé pour ${business.name}, calibré pour un budget de ${profile.constraints.budget_eur} € et un engagement de ${profile.constraints.hours_per_week}h/semaine. Votre score de compatibilité est de ${match.score}%.`,
    whyThisFits: match.strengths.length > 0 ? match.strengths : [
      `Correspondance forte avec vos objectifs de ${profile.goals.priority}.`,
      `Compatible avec votre niveau de compétences et votre budget initial.`,
    ],
    mainConstraints: [
      { id: "c1", label: "Budget initial", severity: profile.constraints.budget_eur < business.economics.budget_min_eur ? "high" : "low", explanation: `Recommandé : ${business.economics.budget_min_eur} €. Votre budget : ${profile.constraints.budget_eur} €.` },
      { id: "c2", label: "Temps hebdomadaire", severity: profile.constraints.hours_per_week < business.economics.hours_per_week_min ? "medium" : "low", explanation: `Recommandé : ${business.economics.hours_per_week_min}h/semaine. Votre temps : ${profile.constraints.hours_per_week}h/semaine.` },
    ],
    positioning: {
      statement: `Positionnement unique sur ${business.family} axé sur la valeur et la réactivité.`,
      differentiation: ["Approche orientée résultats rapides", "Maîtrise technique et opérationnelle"],
    },
    idealCustomer: {
      description: "Professionnels ou particuliers ayant un besoin urgent et solvable sur cette thématique.",
      problems: ["Manque de temps", "Besoin d'expertise spécialisée", "Recherche de retour sur investissement mesurable"],
      characteristics: ["Décideur réactif", "Budget validé"],
    },
    offer: {
      coreOffer: `Offre principale : ${business.name} packagée pour un démarrage rapide.`,
      deliverables: ["Audit initial", "Mise en œuvre de la solution", "Suivi et optimisation"],
      priceRange: {
        min: Math.max(500, business.economics.budget_min_eur),
        max: Math.max(2500, business.economics.budget_min_eur * 3),
        currency: "EUR",
      },
    },
    acquisitionChannels: [
      { channel: "Outreach direct & Réseau", priority: 1, rationale: "Le moyen le plus rapide d'obtenir des clients sans budget publicitaire.", firstAction: "Identifier 30 contacts cibles." },
      { channel: "Inbound Content / SEO", priority: 2, rationale: "Création d'autorité à moyen terme.", firstAction: "Rédiger 2 articles fondateurs." },
    ],
    monetization: {
      model: univ === "software" ? "Abonnement SaaS récurrent (MRR)" : univ === "agency_services" ? "Prestation forfaitaire + Retainer mensuel" : "Vente unitaire à forte marge",
      strategy: "Optimiser la valeur vie client (LTV) dès la première vente.",
    },
    launchStrategy: `Lancement lean en moins de ${business.economics.first_revenue_weeks_typical} semaines en ciblant en priorité votre réseau et une prospection directe.`,
    executionPlan: phases,
    milestones: [
      { id: "m1", name: "Validation de l'offre", target: "Jour 14" },
      { id: "m2", name: "Premiers prospects qualifiés", target: "Jour 30" },
      { id: "m3", name: "Premier client signé / payant", target: `Jour ${business.economics.first_revenue_weeks_typical * 7}` },
    ],
    risks: [
      { id: "r1", risk: "Délai de premier revenu plus long que prévu", severity: "medium", mitigation: "Sécuriser un prospect dès la phase de test." },
      { id: "r2", risk: "Dispersion dans les tâches opérationnelles", severity: "low", mitigation: "Se focaliser sur une seule action critique par jour." },
    ],
    metrics: [
      { id: "me1", name: "Prospects contactés par semaine", target: "25", reason: "Assurer un volume de discussion suffisant." },
      { id: "me2", name: "Taux de conversion rendez-vous", target: "20%", reason: "Valider la pertinence de l'accroche." },
    ],
    nextActions: [
      { id: "a1", title: "Valider le positionnement et la cible", description: "Écrire en une phrase votre proposition de valeur.", priority: 1 },
      { id: "a2", title: "Lister 20 contacts ou prospects prioritaires", description: "Commencer la prospection active sans attendre.", priority: 2 },
    ],
  };
}


export class DeterministicBOSGenerator implements BOSGenerator {
  generate(input: BOSGeneratorInput): BOSResult {
    return generateDeterministicBOS(input);
  }
}
