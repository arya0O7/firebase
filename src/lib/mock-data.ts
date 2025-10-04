import type { Pharmacy, Medicine } from '@/types';

// A much larger list of mock medicine names
const allMedicineNames = [
  'Paracetamol', 'Ibuprofen', 'Aspirin', 'Amoxicillin', 'Loratadine',
  'Cetirizine', 'Omeprazole', 'Metformin', 'Atorvastatin', 'Amlodipine',
  'Lisinopril', 'Metoprolol', 'Simvastatin', 'Levothyroxine', 'Albuterol',
  'Gabapentin', 'Hydrochlorothiazide', 'Sertraline', 'Furosemide', 'Acetaminophen',
  'Azithromycin', 'Ciprofloxacin', 'Prednisone', 'Tramadol', 'Clonazepam',
  'Warfarin', 'Cyclobenzaprine', 'Trazodone', 'Citalopram', 'Duloxetine',
  'Fluoxetine', 'Carvedilol', 'Potassium', 'Meloxicam', 'Montelukast',
  'Rosuvastatin', 'Escitalopram', 'Bupropion', 'Venlafaxine', 'Allopurinol',
  'Clopidogrel', 'Quetiapine', 'Ranitidine', 'Naproxen', 'Methylphenidate',
  'Oxycodone', 'Enalapril', 'Losartan', 'Doxycycline', 'Glipizide',
  'Pantoprazole', 'Zolpidem', 'Tamsulosin', 'Amitriptyline', 'Cefdinir',
  'Diclofenac', 'Esomeprazole', 'Fenofibrate', 'Glimepiride', 'Hydroxyzine',
  'Insulin Glargine', 'Januvia', 'Keppra', 'Lamotrigine', 'Mirtazapine',
  'Nortriptyline', 'Olanzapine', 'Pravastatin', 'Risperidone', 'Spironolactone',
  'Topiramate', 'Valacyclovir', 'Wellbutrin', 'Xanax', 'Yasmin',
  'Zyrtec', 'Abilify', 'Actos', 'Adderall', 'Advair',
  'Aldactone', 'Ambien', 'Amoxil', 'AndroGel', 'Aripiprazole',
  'Augmentin', 'Bactrim', 'Benicar', 'Boniva', 'Buspirone',
  'Bystolic', 'Catapres', 'Celebrex', 'Celexa', 'Chantix',
  'Cialis', 'Cleocin', 'Concerta', 'Coreg', 'Coumadin',
  'Cozaar', 'Crestor', 'Cymbalta', 'Deltasone', 'Depakote',
  'Desyrel', 'Detrol', 'Diabeta', 'Diamox', 'Diflucan',
  'Dilantin', 'Dilaudid', 'Diovan', 'Doxepin', 'Effexor',
  'Elavil', 'Endocet', 'Erythromycin', 'Evista', 'Exelon',
  'Flexeril', 'Flomax', 'Flonase', 'Flovent', 'Focalin',
  'Folic Acid', 'Fosamax', 'Geodon', 'Glucophage', 'Humalog',
  'Hydralazine', 'Inderal', 'Janumet', 'Jardiance', 'Klonopin',
  'Lamictal', 'Lantus', 'Lasix', 'Levaquin', 'Lovenox',
  'Lunesta', 'Lyrica', 'Maxalt', 'Medrol', 'Methadone',
  'Methotrexate', 'Micardis', 'Mobic', 'Motrin', 'Nasonex',
  'Neurontin', 'Nexium', 'Niaspan', 'Nitrostat', 'Norvasc',
  'Novolog', 'OxyContin', 'Pamelor', 'Paxi', 'Penicillin',
  'Pepcid', 'Percocet', 'Phenergan', 'Plavix', 'Premarin',
  'Prevacid', 'Prilosec', 'Pristiq', 'ProAir', 'Procardia',
  'Proscar', 'Protonix', 'Proventil', 'Prozac', 'Remeron',
  'Restoril', 'Ritalin', 'Robaxin', 'Roxicodone', 'Seroquel',
  'Singulair', 'Soma', 'Strattera', 'Suboxone', 'Synthroid',
  'Tamiflu', 'Tenormin', 'Tessalon', 'Toprol', 'Toradol',
  'Tricor', 'Tussionex', 'Tylenol', 'Ultram', 'Valium',
  'Valtrex', 'Vancocin', 'Vasotec', 'Verelan', 'Vibramycin',
  'Vicodin', 'Viagra', 'Vistaril', 'Vitamin D', 'Voltaren',
  'Vyvanse', 'Wellbutrin SR', 'Xarelto', 'Zanaflex', 'Zantac',
  'Zetia', 'Zithromax', 'Zocor', 'Zofran', 'Zoloft',
  'Zyloprim', 'Zyprexa', 'Abacavir', 'Acyclovir', 'Adalimumab',
  'Crocin', 'Benadryl', 'Calpol', 'Dolo 650', 'Disprin',
  'Ecosprin', 'Gelusil', 'Digene', 'Eno', 'Volini',
  'Moov', 'Iodex', 'Saridon', 'Vicks Action 500', 'Cheston Cold',
  'Sinarest', 'Otrivin', 'Nasivion', 'Avil', 'Allegra',
  'Clarinase', 'Strepsils', 'Cofsils', 'Halls', 'Tusq',
  'Alex', 'Grilinctus', 'Ascoril', 'Zentel', 'Band-Aid',
  'Dettol', 'Savlon', 'Betadine', 'Soframycin', 'Neosporin',
  'Cipladine', 'Burnol', 'Silverex', 'Boroline', 'B-Tex',
  'Itch Guard', 'Ring Guard', 'Selsun', 'Nizoral', 'Candid',
  'Canesten', 'Clotrimazole', 'Miconazole', 'Terbinafine', 'Luliconazole',
  'Amruntanjan', 'Zandu Balm', 'Tiger Balm', 'Himalaya Pain Balm', 'Pudin Hara',
  'Hajmola', 'Isabgol', 'Lactulose', 'Smuth', 'Cremaffin',
  'Dulcolax', 'Looz', 'Milk of Magnesia', 'Polyethylene Glycol', 'Bisacodyl',
  'Docusate', 'Senna', 'Castor Oil', 'Glycerin Suppository', 'Fleet Enema',
  'Electral', 'ORS', 'Oral Rehydration Salts', 'Prolyte', 'Walyte',
  'Ondansetron', 'Domperidone', 'Metoclopramide', 'Hyoscine', 'Dicyclomine',
  'Mebeverine', 'Rantac', 'Aciloc', 'Zinetac', 'Omez',
  'Pantop', 'Pantocid', 'Nexpro', 'Rabekind', 'Razo',
  'Sucralfate', 'Misoprostol', 'Lactobacillus', 'Saccharomyces boulardii', 'Bifilac',
  'Eldoper', 'Lomotil', 'Loperamide', 'Racecadotril', 'Ofloxacin',
  'Norfloxacin', 'Tinidazole', 'Metronidazole', 'Rifaximin', 'Albendazole',
  'Mebendazole', 'Pyrantel', 'Ivermectin', 'Levamisole', 'Niclosamide',
  'Praziquantel', 'Diethylcarbamazine', 'Doxycycline', 'Tetracycline', 'Minocycline',
  'Erythromycin', 'Roxithromycin', 'Clarithromycin', 'Azithromycin', 'Cefixime',
  'Cefpodoxime', 'Cefuroxime', 'Ceftriaxone', 'Cefotaxime', 'Cefepime',
  'Ceftazidime', 'Meropenem', 'Imipenem', 'Ertapenem', 'Doripenem',
  'Vancomycin', 'Teicoplanin', 'Linezolid', 'Tedizolid', 'Daptomycin',
  'Tigecycline', 'Colistin', 'Polymyxin B', 'Amikacin', 'Gentamicin',
  'Tobramycin', 'Streptomycin', 'Kanamycin', 'Neomycin', 'Ciprofloxacin',
  'Ofloxacin', 'Levofloxacin', 'Moxifloxacin', 'Gatifloxacin', 'Norfloxacin',
  'Sulfamethoxazole', 'Trimethoprim', 'Co-trimoxazole', 'Dapsone', 'Clofazimine',
  'Rifampicin', 'Isoniazid', 'Pyrazinamide', 'Ethambutol', 'Streptomycin',
  'Fluconazole', 'Itraconazole', 'Voriconazole', 'Posaconazole', 'Amphotericin B',
  'Nystatin', 'Flucytosine', 'Caspofungin', 'Micafungin', 'Anidulafungin',
  'Acyclovir', 'Valacyclovir', 'Famciclovir', 'Ganciclovir', 'Valganciclovir',
  'Foscarnet', 'Cidofovir', 'Oseltamivir', 'Zanamivir', 'Peramivir',
  'Baloxavir', 'Amantadine', 'Rimantadine', 'Ribavirin', 'Interferon'
];


// Function to generate random medicines for a pharmacy
const generateRandomMedicines = (count: number): Medicine[] => {
  const medicines: Medicine[] = [];
  const usedNames = new Set<string>();

  while (medicines.length < count && usedNames.size < allMedicineNames.length) {
    const name = allMedicineNames[Math.floor(Math.random() * allMedicineNames.length)];
    if (!usedNames.has(name)) {
      usedNames.add(name);
      medicines.push({
        id: `med_${name.replace(/\s+/g, '_')}_${Math.random().toString(36).substr(2, 9)}`,
        name,
        stock: Math.floor(Math.random() * 201), // Stock between 0 and 200
        price: parseFloat((Math.random() * (50 - 2) + 2).toFixed(2)), // Price between 2.00 and 50.00
      });
    }
  }

  return medicines;
};

export const mockMedicines: Medicine[] = allMedicineNames.slice(0, 8).map((name, i) => ({
    id: `med${i + 1}`,
    name,
    stock: Math.floor(Math.random() * 100),
    price: parseFloat((Math.random() * 20).toFixed(2))
}));

export let mockPharmacies: Pharmacy[] = [
    {
        id: 'pharm1',
        name: 'Wellness Forever',
        address: '8th Main Rd, Koramangala 4th Block, Koramangala, Bengaluru, Karnataka 560034',
        latitude: 12.9352,
        longitude: 77.6245,
        medicines: generateRandomMedicines(200),
      },
      {
        id: 'pharm2',
        name: 'Apollo Pharmacy',
        address: '100 Feet Rd, Indiranagar, Bengaluru, Karnataka 560038',
        latitude: 12.9784,
        longitude: 77.6408,
        medicines: generateRandomMedicines(200),
      },
      {
        id: 'pharm3',
        name: 'MedPlus Pharmacy',
        address: '11th Main Rd, Jayanagar, Bengaluru, Karnataka 560041',
        latitude: 12.9252,
        longitude: 77.5828,
        medicines: generateRandomMedicines(200),
      },
      {
        id: 'pharm4',
        name: 'Aster Pharmacy',
        address: '16th Main Rd, BTM 2nd Stage, Bengaluru, Karnataka 560076',
        latitude: 12.9166,
        longitude: 77.6101,
        medicines: generateRandomMedicines(200),
      },
      {
        id: 'pharm5',
        name: 'Himalaya Wellness',
        address: 'CMH Road, Indiranagar, Bengaluru, Karnataka 560038',
        latitude: 12.9780,
        longitude: 77.6383,
        medicines: generateRandomMedicines(200),
      },
      {
        id: 'pharm6',
        name: 'GreenLife Pharmacy',
        address: 'Outer Ring Rd, Marathahalli, Bengaluru, Karnataka 560037',
        latitude: 12.9569,
        longitude: 77.7011,
        medicines: generateRandomMedicines(200),
      },
      {
        id: 'pharm7',
        name: 'Trust Pharmacy',
        address: '27th Main Rd, HSR Layout, Bengaluru, Karnataka 560102',
        latitude: 12.9121,
        longitude: 77.6446,
        medicines: generateRandomMedicines(200),
      },
      {
        id: 'pharm8',
        name: 'Sagar Pharmacy',
        address: 'Bannerghatta Main Rd, J. P. Nagar, Bengaluru, Karnataka 560076',
        latitude: 12.8863,
        longitude: 77.5969,
        medicines: generateRandomMedicines(200),
      },
      {
        id: 'pharm9',
        name: 'Care Pharmacy',
        address: 'New BEL Rd, M.S.Ramaiah Nagar, Bengaluru, Karnataka 560054',
        latitude: 13.0357,
        longitude: 77.5638,
        medicines: generateRandomMedicines(200),
      },
      {
        id: 'pharm10',
        name: 'HealthFirst Pharmacy',
        address: 'Kanakapura Rd, Konanakunte, Bengaluru, Karnataka 560062',
        latitude: 12.8900,
        longitude: 77.5484,
        medicines: generateRandomMedicines(200),
      },
      {
        id: 'pharm11',
        name: 'DavaIndia Generic Pharmacy',
        address: 'Malleshwaram, Bengaluru, Karnataka 560003',
        latitude: 13.0068,
        longitude: 77.5713,
        medicines: generateRandomMedicines(200),
      },
      {
        id: 'pharm12',
        name: 'Whitefield Pharmacy',
        address: 'Whitefield Main Rd, Whitefield, Bengaluru, Karnataka 560066',
        latitude: 12.9716,
        longitude: 77.7499,
        medicines: generateRandomMedicines(200),
      },
      {
        id: 'pharm13',
        name: 'Jan Aushadhi Kendra',
        address: 'Rajajinagar, Bengaluru, Karnataka 560010',
        latitude: 12.9904,
        longitude: 77.5529,
        medicines: generateRandomMedicines(200),
      },
      {
        id: 'pharm14',
        name: 'LifeCare Pharmacy',
        address: 'Electronic City Phase 1, Electronic City, Bengaluru, Karnataka 560100',
        latitude: 12.8452,
        longitude: 77.6602,
        medicines: generateRandomMedicines(200),
      },
      {
        id: 'pharm15',
        name: 'City Medicals',
        address: 'Frazer Town, Bengaluru, Karnataka 560005',
        latitude: 12.9975,
        longitude: 77.6143,
        medicines: generateRandomMedicines(200),
      },
      {
        id: 'pharm16',
        name: 'Noble Pharmacy',
        address: 'Basavanagudi, Bengaluru, Karnataka 560004',
        latitude: 12.9436,
        longitude: 77.5714,
        medicines: generateRandomMedicines(200),
      }
];
