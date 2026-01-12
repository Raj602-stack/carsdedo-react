export const normalizeCar = (car) => {
    // Debug: Log the raw car object to see actual field names
    if (process.env.NODE_ENV === 'development') {
      console.log('Raw car data from API:', car);
      // Check all possible insurance field variations
      const insuranceFields = Object.keys(car || {}).filter(key => 
        key.toLowerCase().includes('insurance') || key.toLowerCase().includes('rto') || key.toLowerCase().includes('location')
      );
      console.log('Insurance/RTO/Location related fields:', insuranceFields);
      insuranceFields.forEach(field => {
        console.log(`  ${field}:`, car[field]);
      });
      // Specifically check the exact field names we're looking for
      console.log('Direct field checks:', {
        'insurance_valid_till': car.insurance_valid_till,
        'insurance_type': car.insurance_type,
        'typeof insurance_valid_till': typeof car.insurance_valid_till,
        'typeof insurance_type': typeof car.insurance_type,
        'hasOwnProperty insurance_valid_till': car.hasOwnProperty ? car.hasOwnProperty('insurance_valid_till') : 'N/A',
        'hasOwnProperty insurance_type': car.hasOwnProperty ? car.hasOwnProperty('insurance_type') : 'N/A',
      });
      
      // Calculate what will be assigned BEFORE creating the result object
      const insuranceValidValue = car.insurance_valid_till || car.insurance_valid || car.insuranceValid || 
                                   car.insurance_validity || car.insurance_validity_date || car.insurance_valid_until || 
                                   car.insurance_expiry || car.insurance_expiry_date ||
                                   (car.insurance && (car.insurance.validity || car.insurance.valid || car.insurance.valid_until || car.insurance.expiry || car.insurance.expiry_date)) ||
                                   undefined;
      const insuranceTypeValue = car.insurance_type || car.insuranceType || car.insurance_category || 
                                 (typeof car.insurance === 'object' && car.insurance.type) ||
                                 (typeof car.insurance === 'object' && car.insurance.category) ||
                                 (typeof car.insurance === 'string' ? car.insurance : undefined) ||
                                 undefined;
      
      console.log('normalizeCar - Values BEFORE assignment:', {
        insuranceValid: insuranceValidValue,
        insuranceType: insuranceTypeValue,
        'insuranceValid === undefined': insuranceValidValue === undefined,
        'insuranceType === undefined': insuranceTypeValue === undefined,
      });
    }
    
    // Calculate insurance values BEFORE creating result object
    const insuranceValidValue = car.insurance_valid_till || car.insurance_valid || car.insuranceValid || 
                                 car.insurance_validity || car.insurance_validity_date || car.insurance_valid_until || 
                                 car.insurance_expiry || car.insurance_expiry_date ||
                                 (car.insurance && (car.insurance.validity || car.insurance.valid || car.insurance.valid_until || car.insurance.expiry || car.insurance.expiry_date)) ||
                                 undefined;
    const insuranceTypeValue = car.insurance_type || car.insuranceType || car.insurance_category || 
                               (typeof car.insurance === 'object' && car.insurance.type) ||
                               (typeof car.insurance === 'object' && car.insurance.category) ||
                               (typeof car.insurance === 'string' ? car.insurance : undefined) ||
                               undefined;
    
    const result = {
      id: car.id,
      title: car.title,
      brand: car.brand,
      model: car.model,
      year: car.year,
      makeYear: car.make_year || car.makeYear,
      regYear: car.reg_year || car.regYear,
      price: Number(car.discount_price || car.price || 0),
      originalPrice: Number(car.price || 0),
      km: car.km,
      fuel: car.fuel,
      transmission: car.transmission || car.trans,
      body: car.body,
      city: car.city,
      locationRto: car.rto || car.location_rto || car.locationRto || car.rto_code || 
                   (car.location && car.location.rto) || (car.location && car.location.rto_code),
      locationFull: car.location_full || car.locationFull || car.location || car.full_location ||
                   (typeof car.location === 'object' && car.location.full) ||
                   (typeof car.location === 'object' && car.location.name),
      // API uses insurance_valid_till and insurance_type - check these FIRST
      // Also handle case where car might already be normalized (has insuranceValid/insuranceType)
      insuranceValid: insuranceValidValue,
      insuranceType: insuranceTypeValue,
      colorKey: car.color_key || car.colorKey || car.color,
      tags: car.tags || [],
  
      // ✅ OLD image compatibility
      image:
        car.images?.exterior?.[0]?.image
          ? `http://localhost:8000${car.images.exterior[0].image}`
          : process.env.PUBLIC_URL + "/placeholder-car.png",
  
      images: {
        exterior:
          car.images?.exterior?.map((i) =>
            `http://localhost:8000${i.image}`
          ) || [],
        interior:
          car.images?.interior?.map((i) =>
            `http://localhost:8000${i.image}`
          ) || [],
        engine: [],
        tyres: [],
        overview: [],
      },
  
      owner: car.owner_count 
        ? (car.owner_count === 1 ? "1st Owner" : `${car.owner_count} Owner(s)`)
        : (car.owner ? car.owner : "1st Owner"),
      
      /* =========================
         REASONS TO BUY
      ========================== */
      reasonsToBuy: (car.reasons_to_buy || [])
        .sort((a, b) => a.sort_order - b.sort_order)
        .map((r) => ({
          title: r.title,
          description: r.description,
        })),

      /* =========================
         SPECS (FLATTENED)
      ========================== */
      specs: Object.entries(car.specs || {}).flatMap(
        ([category, items]) =>
          items.map((i) => ({
            category,
            label: i.label,
            value: i.value,
          }))
      ),

      /* =========================
         FEATURES
      ========================== */
      // UI-friendly (grouped)
      featuresByCategory: Object.entries(car.features || {}).map(
        ([category, items]) => ({
          category,
          items: items.map((f) => f.name),
        })
      ),

      // Logic-friendly (flat)
      features: Object.values(car.features || {})
        .flat()
        .map((f) => f.name),
  
      /* =========================
         QUALITY REPORT
      ========================== */
      inspections: (car.inspections || []).map((section) => ({
        key: section.key,
        title: section.title,
        description: section.description,
        score: section.score,
        rating: section.rating,
        status: section.status,
        remarks: section.remarks,
        subsections: (section.subsections || []).map((sub) => ({
          key: sub.key,
          title: sub.title,
          status: sub.status,
          remarks: sub.remarks,
          items: (sub.items || []).map((item) => ({
            name: item.name,
            status: item.status, // flawless | minor | major
            remarks: item.remarks,
          })),
        })),
      })),
    };
    
    // Debug: Log the normalized result
    if (process.env.NODE_ENV === 'development') {
      console.log('normalizeCar - normalized result:', {
        insuranceValid: result.insuranceValid,
        insuranceType: result.insuranceType,
      });
    }
    
    return result;
  };

  