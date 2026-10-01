import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Image,
  Alert,
  Platform,
} from "react-native";
import {
  ArrowLeft,
  ArrowRight,
  Home,
  DollarSign,
  Key,
  MapPin,
  Building,
  CheckCircle2,
  AlertTriangle,
  Upload,
  Crown,
  Sparkles,
  Layers,
  Edit,
  Plus,
  Check,
  X,
} from "lucide-react-native";
import COLORS from "../../constants/colors";
import { useOwner } from "../../context/OwnerContext";
import RestampLogo from "../../components/RestampLogo";
import StepIndicator from "../../components/owner/StepIndicator";
import FormInput from "../../components/owner/FormInput";
import SelectionChip from "../../components/owner/SelectionChip";
import ImageUploadCard from "../../components/owner/ImageUploadCard";
import DocumentUploadCard from "../../components/owner/DocumentUploadCard";
import PrimaryButton from "../../components/owner/PrimaryButton";
import SecondaryButton from "../../components/owner/SecondaryButton";
import ConfirmationModal from "../../components/owner/ConfirmationModal";

const PROPERTY_TYPES_BY_CAT = {
  Residential: ["Apartment", "Villa", "House", "Plot"],
  Commercial: ["Office", "Shop", "Commercial Building", "Warehouse"],
  Land: ["Plot", "Agricultural Land", "Commercial Land"],
};

const AMENITIES_LIST = [
  "Lift",
  "Security",
  "Power Backup",
  "Gym",
  "Parking",
  "CCTV",
  "Club House",
  "Park",
  "Swimming Pool",
  "Rainwater Harvesting",
];

const PHOTO_CATEGORIES = [
  "Living Room",
  "Bedroom",
  "Kitchen",
  "Bathroom",
  "Exterior",
  "Balcony",
  "Floor Plan",
];

const SAMPLE_PHOTO_URLS = {
  "Living Room": "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80",
  Bedroom: "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=800&q=80",
  Kitchen: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80",
  Bathroom: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80",
  Exterior: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
  Balcony: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80",
  "Floor Plan": "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=800&q=80",
};

export default function OwnerAddPropertyScreen({ route, navigation }) {
  const { addProperty, subscription } = useOwner();

  // Mode: initial purpose selection modal or direct form step
  const [purposeSelected, setPurposeSelected] = useState(
    route?.params?.editingProperty?.purpose || null
  );
  const [currentStep, setCurrentStep] = useState(
    route?.params?.initialStep || 1
  );

  useEffect(() => {
    if (route?.params?.resetForm) {
      setCurrentStep(1);
      setPurposeSelected(null);
    }
  }, [route?.params?.resetForm]);

  // Form State
  const [purpose, setPurpose] = useState(
    route?.params?.editingProperty?.purpose || "Rent"
  );
  const [category, setCategory] = useState(
    route?.params?.editingProperty?.category || "Residential"
  );
  const [propertyType, setPropertyType] = useState(
    route?.params?.editingProperty?.propertyType || "Apartment"
  );
  const [bhk, setBhk] = useState(route?.params?.editingProperty?.bhk || "2");

  // Step 2: Location
  const [city, setCity] = useState(
    route?.params?.editingProperty?.city || "Chennai"
  );
  const [district, setDistrict] = useState(
    route?.params?.editingProperty?.district || "Chennai"
  );
  const [locality, setLocality] = useState(
    route?.params?.editingProperty?.locality || "Anna Nagar"
  );
  const [address, setAddress] = useState(
    route?.params?.editingProperty?.address || "Plot 42, 5th Avenue, Shanthi Colony"
  );
  const [landmark, setLandmark] = useState(
    route?.params?.editingProperty?.landmark || "Opposite Tower Park"
  );
  const [mapPinned, setMapPinned] = useState(true);

  // Step 3: Details
  const [builtUpArea, setBuiltUpArea] = useState(
    route?.params?.editingProperty?.builtUpArea?.replace(" sq.ft", "") || "1200"
  );
  const [carpetArea, setCarpetArea] = useState(
    route?.params?.editingProperty?.carpetArea?.replace(" sq.ft", "") || "950"
  );
  const [floor, setFloor] = useState(route?.params?.editingProperty?.floor || "3");
  const [totalFloors, setTotalFloors] = useState(
    route?.params?.editingProperty?.totalFloors || "8"
  );
  const [propertyAge, setPropertyAge] = useState(
    route?.params?.editingProperty?.propertyAge || "5 Years"
  );
  const [facing, setFacing] = useState(
    route?.params?.editingProperty?.facing || "East"
  );
  const [furnishing, setFurnishing] = useState(
    route?.params?.editingProperty?.furnishing || "Semi Furnished"
  );
  const [parking, setParking] = useState(
    route?.params?.editingProperty?.parking || "Yes"
  );
  const [amenities, setAmenities] = useState(
    route?.params?.editingProperty?.amenities || [
      "Lift",
      "Security",
      "Power Backup",
      "Gym",
      "Parking",
      "CCTV",
    ]
  );

  // Step 4: Pricing (Rent vs Sell vs Lease)
  // Rent:
  const [monthlyRent, setMonthlyRent] = useState("25000");
  const [securityDeposit, setSecurityDeposit] = useState("100000");
  const [maintenance, setMaintenance] = useState("3000");
  const [availableFrom, setAvailableFrom] = useState("25 Sep 2026");

  // Sell:
  const [expectedPrice, setExpectedPrice] = useState("7200000");
  const [priceNegotiable, setPriceNegotiable] = useState("Yes");
  const [pricePerSqft, setPricePerSqft] = useState("6000");

  // Lease:
  const [leaseAmount, setLeaseAmount] = useState("70000");
  const [leaseDeposit, setLeaseDeposit] = useState("400000");
  const [leaseDuration, setLeaseDuration] = useState("3 Years");
  const [lockInPeriod, setLockInPeriod] = useState("1 Year");

  // Step 5: Media & Docs
  const [coverPhoto, setCoverPhoto] = useState(
    "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80"
  );
  const [categoryPhotos, setCategoryPhotos] = useState({
    "Living Room": [
      { id: "p1", url: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80" },
    ],
    Bedroom: [
      { id: "p2", url: "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=800&q=80" },
    ],
    Kitchen: [
      { id: "p3", url: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80" },
    ],
  });

  const [documents, setDocuments] = useState([
    { id: "doc-1", name: "Ownership_Title_Deed.pdf", type: "Ownership Proof", status: "Verified" },
    { id: "doc-2", name: "Property_Tax_Receipt.pdf", type: "Property Document", status: "Uploaded" },
  ]);

  // Subscription Renewal Modal
  const [showRenewModal, setShowRenewModal] = useState(false);

  // Toggle Amenity
  const toggleAmenity = (item) => {
    if (amenities.includes(item)) {
      setAmenities(amenities.filter((a) => a !== item));
    } else {
      setAmenities([...amenities, item]);
    }
  };

  // Add Photo Mock
  const handleAddPhoto = (cat) => {
    const defaultUrl = SAMPLE_PHOTO_URLS[cat] || SAMPLE_PHOTO_URLS["Living Room"];
    setCategoryPhotos((prev) => ({
      ...prev,
      [cat]: [...(prev[cat] || []), { id: `photo-${Date.now()}`, url: defaultUrl }],
    }));
  };

  const handleRemovePhoto = (cat, id) => {
    setCategoryPhotos((prev) => ({
      ...prev,
      [cat]: (prev[cat] || []).filter((p) => p.id !== id),
    }));
  };

  const handleUploadDocument = () => {
    const newDoc = {
      id: `doc-${Date.now()}`,
      name: `Electricity_Bill_${city}.pdf`,
      type: "Property Document",
      status: "Uploaded & Encrypted",
    };
    setDocuments((prev) => [...prev, newDoc]);
  };

  const handleRemoveDocument = (id) => {
    setDocuments((prev) => prev.filter((d) => d.id !== id));
  };

  // Final Publish Handler
  const handlePublishProperty = () => {
    // Check subscription active
    const isSubActive = subscription?.active && (subscription?.usedListings || 0) < (subscription?.listingLimit || 5);

    if (!isSubActive) {
      setShowRenewModal(true);
      return;
    }

    // Assemble property object
    const calculatedTitle =
      category === "Residential" && bhk !== "N/A"
        ? `${bhk} BHK ${propertyType}`
        : `${category} ${propertyType}`;

    let finalPrice = parseInt(monthlyRent) || 25000;
    let priceFormatted = `₹${finalPrice.toLocaleString("en-IN")} / month`;
    let depositVal = parseInt(securityDeposit) || 100000;

    if (purpose === "Sell") {
      finalPrice = parseInt(expectedPrice) || 7200000;
      priceFormatted =
        finalPrice >= 10000000
          ? `₹${(finalPrice / 10000000).toFixed(2)} Cr`
          : `₹${(finalPrice / 100000).toFixed(1)} Lakhs`;
      depositVal = 0;
    } else if (purpose === "Lease") {
      finalPrice = parseInt(leaseAmount) || 70000;
      priceFormatted = `₹${finalPrice.toLocaleString("en-IN")} / month`;
      depositVal = parseInt(leaseDeposit) || 400000;
    }

    const newProperty = {
      title: calculatedTitle,
      purpose,
      category,
      propertyType,
      bhk: category === "Residential" ? bhk : "N/A",
      city,
      district,
      locality,
      address,
      landmark,
      price: finalPrice,
      priceFormatted,
      priceUnit: purpose === "Sell" ? "" : "/ month",
      deposit: depositVal,
      maintenance: parseInt(maintenance) || 3000,
      availableFrom,
      builtUpArea: `${builtUpArea} sq.ft`,
      carpetArea: `${carpetArea} sq.ft`,
      floor,
      totalFloors,
      propertyAge,
      facing,
      furnishing,
      parking,
      amenities,
      images: [
        coverPhoto,
        ...Object.values(categoryPhotos).flatMap((arr) => arr.map((x) => x.url)),
      ],
      coverPhoto,
      documents,
      status: "pending",
    };

    addProperty(newProperty);

    // Navigate to Property Publish Success screen
    navigation.navigate("OwnerPublishSuccess", { property: newProperty });
  };

  // =========================================================================
  // VIEW 1: WHAT DO YOU WANT TO DO? (INITIAL SELECTION CARDS)
  // =========================================================================
  if (!purposeSelected) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

        {/* TOP HEADER: Brand Logo | Subtitle & Title | Circular Back Button */}
        <View style={styles.topHeader}>
          <View style={styles.headerLeft}>
            <TouchableOpacity
              style={styles.headerCircleBtn}
              onPress={() => navigation.goBack()}
              activeOpacity={0.7}
            >
              <ArrowLeft size={19} color="#111111" strokeWidth={2.2} />
            </TouchableOpacity>

            <View style={styles.brandIconWrapper}>
              <RestampLogo size={32} />
            </View>

            <View style={styles.headerTitles}>
              <Text style={styles.headerSubtitle}>RESTAMP Owner Studio</Text>
              <Text style={styles.headerTitle}>Add Property</Text>
            </View>
          </View>
        </View>

        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Quick Switch Mode Pill Banner */}
          <TouchableOpacity
            style={styles.switchBanner}
            onPress={() =>
              navigation.reset({
                index: 0,
                routes: [{ name: "MainTabs" }],
              })
            }
            activeOpacity={0.8}
          >
            <View style={styles.switchBannerLeft}>
              <ArrowLeft size={15} color="#111111" strokeWidth={2.4} style={{ marginRight: 8 }} />
              <Text style={styles.switchBannerTitle}>Back to Buyer App</Text>
            </View>
            <View style={styles.switchBannerBadge}>
              <Text style={styles.switchBannerBadgeText}>Switch Mode</Text>
            </View>
          </TouchableOpacity>

          {/* Reference Container Card matching user's design reference */}
          <View style={styles.referenceContainerCard}>
            <Text style={styles.referenceBigTitle}>
              Where are you{"\n"}planning to list?
            </Text>

            {/* List of Option Cards styled like Barcelona / Madrid cards in reference */}
            <View style={styles.referenceCardsList}>
              {/* Option 1: Rent Property */}
              <TouchableOpacity
                style={[
                  styles.referenceItemCard,
                  purpose === "Rent" && styles.referenceItemCardSelected,
                ]}
                onPress={() => setPurpose("Rent")}
                activeOpacity={0.8}
              >
                <View style={{ flex: 1 }}>
                  <Text style={styles.referenceItemTitle}>Rent Property</Text>
                  <Text style={styles.referenceItemSub}>
                    Verified tenants, 0% brokerage • High rental yield
                  </Text>
                </View>
                <View
                  style={[
                    styles.referenceCheckCircle,
                    purpose === "Rent" && styles.referenceCheckCircleSelected,
                  ]}
                >
                  {purpose === "Rent" ? (
                    <Check size={14} color="#FFFFFF" strokeWidth={2.8} />
                  ) : (
                    <View style={styles.referenceCheckDot} />
                  )}
                </View>
              </TouchableOpacity>

              {/* Option 2: Sell Property */}
              <TouchableOpacity
                style={[
                  styles.referenceItemCard,
                  purpose === "Sell" && styles.referenceItemCardSelected,
                ]}
                onPress={() => setPurpose("Sell")}
                activeOpacity={0.8}
              >
                <View style={{ flex: 1 }}>
                  <Text style={styles.referenceItemTitle}>Sell Property</Text>
                  <Text style={styles.referenceItemSub}>
                    Direct pre-qualified buyers • Zero middleman cuts
                  </Text>
                </View>
                <View
                  style={[
                    styles.referenceCheckCircle,
                    purpose === "Sell" && styles.referenceCheckCircleSelected,
                  ]}
                >
                  {purpose === "Sell" ? (
                    <Check size={14} color="#FFFFFF" strokeWidth={2.8} />
                  ) : (
                    <View style={styles.referenceCheckDot} />
                  )}
                </View>
              </TouchableOpacity>

              {/* Option 3: Lease Property */}
              <TouchableOpacity
                style={[
                  styles.referenceItemCard,
                  purpose === "Lease" && styles.referenceItemCardSelected,
                ]}
                onPress={() => setPurpose("Lease")}
                activeOpacity={0.8}
              >
                <View style={{ flex: 1 }}>
                  <Text style={styles.referenceItemTitle}>Lease Property</Text>
                  <Text style={styles.referenceItemSub}>
                    Corporate & long-term agreements • Fixed tenure
                  </Text>
                </View>
                <View
                  style={[
                    styles.referenceCheckCircle,
                    purpose === "Lease" && styles.referenceCheckCircleSelected,
                  ]}
                >
                  {purpose === "Lease" ? (
                    <Check size={14} color="#FFFFFF" strokeWidth={2.8} />
                  ) : (
                    <View style={styles.referenceCheckDot} />
                  )}
                </View>
              </TouchableOpacity>
            </View>

            {/* "Add one more place" style action row with (+) button */}
            <TouchableOpacity
              style={styles.addMoreRow}
              onPress={() => setPurposeSelected(purpose)}
              activeOpacity={0.75}
            >
              <Text style={styles.addMoreText}>Specify listing details</Text>
              <View style={styles.blackAddCircle}>
                <Plus size={18} color="#FFFFFF" strokeWidth={2.5} />
              </View>
            </TouchableOpacity>

            {/* Big Black "Apply" Pill Button from reference */}
            <TouchableOpacity
              style={styles.applyPillBtn}
              onPress={() => setPurposeSelected(purpose)}
              activeOpacity={0.88}
            >
              <Text style={styles.applyPillBtnText}>Apply</Text>
            </TouchableOpacity>
          </View>

          <View style={{ height: 40 }} />
        </ScrollView>
      </SafeAreaView>
    );
  }

  // =========================================================================
  // VIEW 2: 6-STEP ADD PROPERTY FORM
  // =========================================================================
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* TOP HEADER: Brand Logo | Subtitle & Title | Cancel Button */}
      <View style={styles.topHeader}>
        <View style={styles.headerLeft}>
          <TouchableOpacity
            style={styles.headerCircleBtn}
            onPress={() => {
              if (currentStep > 1) {
                setCurrentStep(currentStep - 1);
              } else {
                setPurposeSelected(null);
                navigation.navigate("Dashboard");
              }
            }}
            activeOpacity={0.7}
          >
            <ArrowLeft size={19} color="#111111" strokeWidth={2.2} />
          </TouchableOpacity>

          <View style={styles.brandIconWrapper}>
            <RestampLogo size={32} />
          </View>

          <View style={styles.headerTitles}>
            <Text style={styles.headerSubtitle}>RESTAMP Owner Studio</Text>
            <Text style={styles.headerTitle}>
              {purpose} Property • Step {currentStep}/6
            </Text>
          </View>
        </View>

        <View style={styles.headerRight}>
          <TouchableOpacity
            style={styles.cancelPillBtn}
            onPress={() => {
              setPurposeSelected(null);
              navigation.navigate("Dashboard");
            }}
            activeOpacity={0.7}
          >
            <Text style={styles.cancelPillText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Progress Indicator at top (Section 7 requirement: exactly 6 steps) */}
      <StepIndicator currentStep={currentStep} />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* =======================================================
            STEP 1 — PROPERTY
            ======================================================= */}
        {currentStep === 1 && (
          <View style={styles.bigCard}>
            <View style={styles.bigCardHeader}>
              <View>
                <Text style={styles.bigCardTitle}>Property Category & Type</Text>
                <Text style={styles.bigCardSubtitle}>
                  Specify what kind of property you are listing
                </Text>
              </View>
            </View>

            {/* Purpose Segmented Cards */}
            <Text style={styles.fieldHeading}>Listing Purpose</Text>
            <View style={styles.segmentedRow}>
              {["Rent", "Sell", "Lease"].map((p) => (
                <SelectionChip
                  key={p}
                  label={p}
                  selected={purpose === p}
                  variant="segmented"
                  onPress={() => setPurpose(p)}
                />
              ))}
            </View>

            {/* Property Category */}
            <Text style={styles.fieldHeading}>Property Category</Text>
            <View style={styles.chipsRow}>
              {["Residential", "Commercial", "Land"].map((cat) => (
                <SelectionChip
                  key={cat}
                  label={cat}
                  selected={category === cat}
                  onPress={() => {
                    setCategory(cat);
                    const types = PROPERTY_TYPES_BY_CAT[cat] || [];
                    if (!types.includes(propertyType)) {
                      setPropertyType(types[0] || "Apartment");
                    }
                  }}
                />
              ))}
            </View>

            {/* Property Type */}
            <Text style={styles.fieldHeading}>Property Type</Text>
            <View style={styles.chipsRow}>
              {(PROPERTY_TYPES_BY_CAT[category] || [
                "Apartment",
                "Villa",
                "House",
                "Office",
                "Shop",
                "Plot",
                "Agricultural Land",
              ]).map((t) => (
                <SelectionChip
                  key={t}
                  label={t}
                  selected={propertyType === t}
                  onPress={() => setPropertyType(t)}
                />
              ))}
            </View>

            {/* BHK (for Residential) */}
            {category === "Residential" && (
              <>
                <Text style={styles.fieldHeading}>BHK Type</Text>
                <View style={styles.chipsRow}>
                  {["1", "2", "3", "4+"].map((b) => (
                    <SelectionChip
                      key={b}
                      label={`${b} BHK`}
                      selected={bhk === b}
                      onPress={() => setBhk(b)}
                    />
                  ))}
                </View>
              </>
            )}
          </View>
        )}

        {/* =======================================================
            STEP 2 — LOCATION
            ======================================================= */}
        {currentStep === 2 && (
          <View style={styles.bigCard}>
            <View style={styles.bigCardHeader}>
              <View>
                <Text style={styles.bigCardTitle}>Property Location</Text>
                <Text style={styles.bigCardSubtitle}>
                  Accurate locality details ensure relevant buyer inquiries in your neighborhood
                </Text>
              </View>
            </View>

            <FormInput
              label="City"
              value={city}
              onChangeText={setCity}
              placeholder="e.g. Chennai"
            />

            <FormInput
              label="District"
              value={district}
              onChangeText={setDistrict}
              placeholder="e.g. Chennai"
            />

            <FormInput
              label="Locality"
              value={locality}
              onChangeText={setLocality}
              placeholder="e.g. Anna Nagar"
            />

            <FormInput
              label="Address"
              value={address}
              onChangeText={setAddress}
              placeholder="Enter property address"
              multiline
            />

            <FormInput
              label="Landmark"
              value={landmark}
              onChangeText={setLandmark}
              placeholder="Enter nearby landmark"
            />

            {/* Map Card */}
            <Text style={styles.fieldHeading}>Map Location</Text>
            <View style={styles.mapCard}>
              <View style={styles.mapVisualBox}>
                <MapPin size={32} color={COLORS.primary} />
                <Text style={styles.mapVisualTitle}>Anna Nagar, Chennai</Text>
                <Text style={styles.mapVisualSub}>Lat: 13.0850° N, Long: 80.2101° E</Text>
              </View>

              <TouchableOpacity
                style={styles.setMapBtn}
                onPress={() => Alert.alert("Map Location Pin", "Map pin set to: " + locality + ", " + city)}
                activeOpacity={0.8}
              >
                <MapPin size={16} color={COLORS.primary} style={{ marginRight: 6 }} />
                <Text style={styles.setMapBtnText}>Set Map Location</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* =======================================================
            STEP 3 — DETAILS
            ======================================================= */}
        {currentStep === 3 && (
          <View style={styles.bigCard}>
            <View style={styles.bigCardHeader}>
              <View>
                <Text style={styles.bigCardTitle}>Property Details & Specs</Text>
                <Text style={styles.bigCardSubtitle}>
                  Specify areas, floor, age, and available amenities
                </Text>
              </View>
            </View>

            <View style={styles.formRow}>
              <FormInput
                label="Built-up Area"
                value={builtUpArea}
                onChangeText={setBuiltUpArea}
                suffix="sq.ft"
                keyboardType="numeric"
                style={{ flex: 1, marginRight: 10 }}
              />
              <FormInput
                label="Carpet Area"
                value={carpetArea}
                onChangeText={setCarpetArea}
                suffix="sq.ft"
                keyboardType="numeric"
                style={{ flex: 1 }}
              />
            </View>

            <View style={styles.formRow}>
              <FormInput
                label="Floor"
                value={floor}
                onChangeText={setFloor}
                placeholder="e.g. 3"
                keyboardType="numeric"
                style={{ flex: 1, marginRight: 10 }}
              />
              <FormInput
                label="Total Floors"
                value={totalFloors}
                onChangeText={setTotalFloors}
                placeholder="e.g. 8"
                keyboardType="numeric"
                style={{ flex: 1 }}
              />
            </View>

            <View style={styles.formRow}>
              <FormInput
                label="Property Age"
                value={propertyAge}
                onChangeText={setPropertyAge}
                placeholder="e.g. 5 Years"
                style={{ flex: 1, marginRight: 10 }}
              />
              <FormInput
                label="Facing"
                value={facing}
                onChangeText={setFacing}
                placeholder="e.g. East"
                style={{ flex: 1 }}
              />
            </View>

            {/* Furnishing */}
            <Text style={styles.fieldHeading}>Furnishing Status</Text>
            <View style={styles.chipsRow}>
              {["Furnished", "Semi Furnished", "Unfurnished"].map((f) => (
                <SelectionChip
                  key={f}
                  label={f}
                  selected={furnishing === f}
                  onPress={() => setFurnishing(f)}
                />
              ))}
            </View>

            {/* Parking */}
            <Text style={styles.fieldHeading}>Covered Parking Available?</Text>
            <View style={styles.chipsRow}>
              {["Yes", "No"].map((p) => (
                <SelectionChip
                  key={p}
                  label={p}
                  selected={parking === p}
                  onPress={() => setParking(p)}
                />
              ))}
            </View>

            {/* Amenities */}
            <Text style={styles.fieldHeading}>Amenities</Text>
            <View style={styles.chipsRow}>
              {AMENITIES_LIST.map((amenity) => (
                <SelectionChip
                  key={amenity}
                  label={amenity}
                  selected={amenities.includes(amenity)}
                  onPress={() => toggleAmenity(amenity)}
                />
              ))}
            </View>
          </View>
        )}

        {/* =======================================================
            STEP 4 — PRICING (DYNAMIC: Rent / Sell / Lease)
            ======================================================= */}
        {currentStep === 4 && (
          <View style={styles.bigCard}>
            <View style={styles.bigCardHeader}>
              <View>
                <Text style={styles.bigCardTitle}>
                  {purpose === "Rent"
                    ? "Rental Terms"
                    : purpose === "Sell"
                    ? "Selling Price & Terms"
                    : "Leasing Terms"}
                </Text>
                <Text style={styles.bigCardSubtitle}>
                  Transparent pricing attracts verified buyers and tenants faster
                </Text>
              </View>
            </View>

            {purpose === "Rent" && (
              <>
                <FormInput
                  label="Monthly Rent"
                  value={monthlyRent}
                  onChangeText={setMonthlyRent}
                  prefix="₹"
                  keyboardType="numeric"
                  helperText="Standard market range for Anna Nagar: ₹22,000 - ₹28,000"
                />

                <FormInput
                  label="Security Deposit"
                  value={securityDeposit}
                  onChangeText={setSecurityDeposit}
                  prefix="₹"
                  keyboardType="numeric"
                  helperText="Typically 5 to 10 months of rent"
                />

                <FormInput
                  label="Maintenance Charges"
                  value={maintenance}
                  onChangeText={setMaintenance}
                  prefix="₹"
                  suffix="/ month"
                  keyboardType="numeric"
                />

                <FormInput
                  label="Available From"
                  value={availableFrom}
                  onChangeText={setAvailableFrom}
                  placeholder="e.g. 25 Sep 2026 or Immediately"
                />
              </>
            )}

            {purpose === "Sell" && (
              <>
                <FormInput
                  label="Expected Price"
                  value={expectedPrice}
                  onChangeText={setExpectedPrice}
                  prefix="₹"
                  keyboardType="numeric"
                  helperText="e.g. 7200000 for ₹72 Lakhs"
                />

                <Text style={styles.fieldHeading}>Price Negotiable?</Text>
                <View style={styles.chipsRow}>
                  {["Yes", "No"].map((neg) => (
                    <SelectionChip
                      key={neg}
                      label={neg}
                      selected={priceNegotiable === neg}
                      onPress={() => setPriceNegotiable(neg)}
                    />
                  ))}
                </View>

                <FormInput
                  label="Price Per Sq.ft"
                  value={pricePerSqft}
                  onChangeText={setPricePerSqft}
                  prefix="₹"
                  suffix="/ sq.ft"
                  keyboardType="numeric"
                />

                <FormInput
                  label="Available From"
                  value={availableFrom}
                  onChangeText={setAvailableFrom}
                  placeholder="Immediately"
                />
              </>
            )}

            {purpose === "Lease" && (
              <>
                <FormInput
                  label="Lease Amount"
                  value={leaseAmount}
                  onChangeText={setLeaseAmount}
                  prefix="₹"
                  suffix="/ month"
                  keyboardType="numeric"
                />

                <FormInput
                  label="Security Deposit"
                  value={leaseDeposit}
                  onChangeText={setLeaseDeposit}
                  prefix="₹"
                  keyboardType="numeric"
                />

                <FormInput
                  label="Lease Duration"
                  value={leaseDuration}
                  onChangeText={setLeaseDuration}
                  placeholder="e.g. 3 Years"
                />

                <FormInput
                  label="Lock-in Period"
                  value={lockInPeriod}
                  onChangeText={setLockInPeriod}
                  placeholder="e.g. 1 Year"
                />
              </>
            )}
          </View>
        )}

        {/* =======================================================
            STEP 5 — MEDIA
            ======================================================= */}
        {currentStep === 5 && (
          <View style={styles.bigCard}>
            <View style={styles.bigCardHeader}>
              <View>
                <Text style={styles.bigCardTitle}>Photos & Documents</Text>
                <Text style={styles.bigCardSubtitle}>
                  Properties with photos and documents receive 5x more verified site visits
                </Text>
              </View>
            </View>

            {/* Photos Categories */}
            <Text style={styles.fieldHeading}>Property Photos</Text>
            {PHOTO_CATEGORIES.map((cat) => (
              <ImageUploadCard
                key={cat}
                categoryTitle={cat}
                photos={categoryPhotos[cat] || []}
                coverPhoto={coverPhoto}
                onAddPhoto={() => handleAddPhoto(cat)}
                onRemovePhoto={(id) => handleRemovePhoto(cat, id)}
                onSetCoverPhoto={(url) => setCoverPhoto(url)}
              />
            ))}

            {/* Documents */}
            <DocumentUploadCard
              documents={documents}
              onUploadDocument={handleUploadDocument}
              onRemoveDocument={handleRemoveDocument}
            />
          </View>
        )}

        {/* =======================================================
            STEP 6 — REVIEW / PREVIEW LISTING
            ======================================================= */}
        {currentStep === 6 && (
          <View style={styles.bigCard}>
            <View style={styles.bigCardHeader}>
              <View style={{ flex: 1, marginRight: 10 }}>
                <Text style={styles.bigCardTitle}>Preview Listing</Text>
                <Text style={styles.bigCardSubtitle}>
                  This is how your property will appear to verified buyers and tenants on RESTAMP
                </Text>
              </View>
              <TouchableOpacity
                style={styles.editStepBtn}
                onPress={() => setCurrentStep(1)}
                activeOpacity={0.7}
              >
                <Edit size={14} color="#2563EB" style={{ marginRight: 4 }} />
                <Text style={styles.editStepBtnText}>Edit</Text>
              </TouchableOpacity>
            </View>

            {/* Preview Card matching Buyer Property Detail page */}
            <View style={styles.previewCard}>
              <View style={styles.previewHero}>
                <Image source={{ uri: coverPhoto }} style={styles.previewHeroImage} />
                <View style={styles.previewBadgePill}>
                  <Text style={styles.previewBadgeText}>FOR {purpose.toUpperCase()}</Text>
                </View>
              </View>

              <View style={styles.previewContent}>
                <Text style={styles.previewTitle}>
                  {category === "Residential" && bhk !== "N/A"
                    ? `${bhk} BHK ${propertyType}`
                    : `${category} ${propertyType}`}
                </Text>
                <View style={styles.previewLocRow}>
                  <MapPin size={13} color={COLORS.textSecondary} style={{ marginRight: 4 }} />
                  <Text style={styles.previewLocText}>
                    {locality}, {city}
                  </Text>
                </View>

                <Text style={styles.previewPrice}>
                  {purpose === "Rent"
                    ? `₹${parseInt(monthlyRent || 0).toLocaleString("en-IN")} / month`
                    : purpose === "Sell"
                    ? `₹${(parseInt(expectedPrice || 0) / 100000).toFixed(1)} Lakhs`
                    : `₹${parseInt(leaseAmount || 0).toLocaleString("en-IN")} / month`}
                </Text>

                {/* Quick specs */}
                <View style={styles.previewSpecsRow}>
                  {category === "Residential" && bhk !== "N/A" && (
                    <View style={styles.previewSpecPill}>
                      <Text style={styles.previewSpecPillText}>{bhk} BHK</Text>
                    </View>
                  )}
                  <View style={styles.previewSpecPill}>
                    <Text style={styles.previewSpecPillText}>{builtUpArea} sqft</Text>
                  </View>
                  <View style={styles.previewSpecPill}>
                    <Text style={styles.previewSpecPillText}>{furnishing}</Text>
                  </View>
                </View>

                {/* Sections: Overview, Property Details, Amenities, Pricing, Location, Description */}
                <View style={styles.previewSection}>
                  <Text style={styles.previewSectionTitle}>Overview</Text>
                  <Text style={styles.previewDescText}>
                    Spacious {bhk} BHK {propertyType} situated in peaceful {locality}.
                    Features east-facing ventilation, ample natural daylight, and reserved parking.
                  </Text>
                </View>

                <View style={styles.previewSection}>
                  <Text style={styles.previewSectionTitle}>Property Details</Text>
                  <View style={styles.specDetailRow}>
                    <Text style={styles.specDetailKey}>Floor Level</Text>
                    <Text style={styles.specDetailVal}>{floor} of {totalFloors}</Text>
                  </View>
                  <View style={styles.specDetailRow}>
                    <Text style={styles.specDetailKey}>Carpet Area</Text>
                    <Text style={styles.specDetailVal}>{carpetArea} sq.ft</Text>
                  </View>
                  <View style={styles.specDetailRow}>
                    <Text style={styles.specDetailKey}>Property Age</Text>
                    <Text style={styles.specDetailVal}>{propertyAge}</Text>
                  </View>
                  <View style={styles.specDetailRow}>
                    <Text style={styles.specDetailKey}>Facing</Text>
                    <Text style={styles.specDetailVal}>{facing}</Text>
                  </View>
                </View>

                <View style={styles.previewSection}>
                  <Text style={styles.previewSectionTitle}>Amenities</Text>
                  <View style={styles.chipsRow}>
                    {amenities.map((a) => (
                      <View key={a} style={styles.amenityChipPreview}>
                        <CheckCircle2 size={12} color={COLORS.primary} style={{ marginRight: 4 }} />
                        <Text style={styles.amenityChipPreviewText}>{a}</Text>
                      </View>
                    ))}
                  </View>
                </View>

                <View style={styles.previewSection}>
                  <Text style={styles.previewSectionTitle}>Pricing & Terms</Text>
                  <View style={styles.specDetailRow}>
                    <Text style={styles.specDetailKey}>
                      {purpose === "Sell" ? "Expected Price" : "Monthly Charge"}
                    </Text>
                    <Text style={styles.specDetailVal}>
                      {purpose === "Rent"
                        ? `₹${parseInt(monthlyRent || 0).toLocaleString("en-IN")}`
                        : purpose === "Sell"
                        ? `₹${(parseInt(expectedPrice || 0) / 100000).toFixed(1)} Lakhs`
                        : `₹${parseInt(leaseAmount || 0).toLocaleString("en-IN")}`}
                    </Text>
                  </View>
                  {purpose !== "Sell" && (
                    <View style={styles.specDetailRow}>
                      <Text style={styles.specDetailKey}>Security Deposit</Text>
                      <Text style={styles.specDetailVal}>
                        ₹{parseInt(securityDeposit || 0).toLocaleString("en-IN")}
                      </Text>
                    </View>
                  )}
                </View>

                <View style={styles.previewSection}>
                  <Text style={styles.previewSectionTitle}>Location</Text>
                  <Text style={styles.previewDescText}>
                    {address}, {landmark ? `Near ${landmark}, ` : ""}{locality}, {city}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Bottom Sticky Action Bar */}
      <View style={styles.bottomBar}>
        {currentStep > 1 && (
          <TouchableOpacity
            style={styles.backBtnPill}
            onPress={() => setCurrentStep(currentStep - 1)}
            activeOpacity={0.8}
          >
            <ArrowLeft size={16} color="#111111" strokeWidth={2.2} style={{ marginRight: 6 }} />
            <Text style={styles.secondaryPillBtnText}>Back</Text>
          </TouchableOpacity>
        )}

        {currentStep < 6 ? (
          <TouchableOpacity
            style={styles.primaryPillBtn}
            onPress={() => setCurrentStep(currentStep + 1)}
            activeOpacity={0.88}
          >
            <Text style={styles.primaryPillBtnText}>Continue</Text>
            <ArrowRight size={17} color="#FFFFFF" strokeWidth={2.4} style={{ marginLeft: 6 }} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.primaryPillBtn}
            onPress={handlePublishProperty}
            activeOpacity={0.88}
          >
            <Upload size={17} color="#FFFFFF" strokeWidth={2.4} style={{ marginRight: 6 }} />
            <Text style={styles.primaryPillBtnText}>Publish Property</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Subscription Expiry / Renewal Modal */}
      <ConfirmationModal
        visible={showRenewModal}
        title="Subscription Renewal Required"
        message="You have utilized your active property listing quota. Renew or upgrade your Owner Plan to publish this property."
        icon={Crown}
        confirmText="Renew Plan"
        cancelText="Cancel"
        onConfirm={() => {
          setShowRenewModal(false);
          navigation.navigate("OwnerPlans");
        }}
        onCancel={() => setShowRenewModal(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  topHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 14,
    backgroundColor: "#FFFFFF",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  headerCircleBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#EEF2F6",
    marginRight: 10,
  },
  brandIconWrapper: {
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  headerTitles: {
    flex: 1,
  },
  headerSubtitle: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: "500",
    letterSpacing: 0.3,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: "500",
    color: "#111111",
    letterSpacing: -0.3,
    marginTop: 2,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  cancelPillBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#EEF2F6",
  },
  cancelPillText: {
    fontSize: 12,
    fontWeight: "500",
    color: COLORS.textSecondary,
  },
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 4,
    paddingBottom: 40,
  },
  switchBanner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#EEF2F6",
  },
  switchBannerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  switchBannerTitle: {
    fontSize: 13,
    fontWeight: "500",
    color: "#111111",
  },
  switchBannerBadge: {
    backgroundColor: "#F1F5F9",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  switchBannerBadgeText: {
    fontSize: 11,
    fontWeight: "500",
    color: "#64748B",
  },
  bigCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 28,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#EEF2F6",
  },
  bigCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  bigCardTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#111111",
    letterSpacing: -0.3,
  },
  bigCardSubtitle: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 2,
    fontWeight: "400",
  },
  referenceContainerCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 32,
    paddingHorizontal: 22,
    paddingVertical: 28,
    borderWidth: 1,
    borderColor: "#EEF2F6",
    marginBottom: 16,
  },
  referenceBigTitle: {
    fontSize: 28,
    fontWeight: "500",
    color: "#111111",
    textAlign: "center",
    letterSpacing: -0.6,
    lineHeight: 36,
    marginBottom: 28,
    marginTop: 4,
  },
  referenceCardsList: {
    gap: 12,
    marginBottom: 18,
  },
  referenceItemCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: "#EEF2F6",
    paddingHorizontal: 20,
    paddingVertical: 18,
  },
  referenceItemCardSelected: {
    borderColor: "#2563EB",
    backgroundColor: "#EFF6FF",
  },
  referenceItemTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#111111",
    marginBottom: 3,
  },
  referenceItemSub: {
    fontSize: 12,
    color: "#64748B",
    fontWeight: "400",
  },
  referenceCheckCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#E2E8F0",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 12,
  },
  referenceCheckCircleSelected: {
    backgroundColor: "#2563EB",
  },
  referenceCheckDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#94A3B8",
  },
  addMoreRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 4,
    marginBottom: 24,
  },
  addMoreText: {
    fontSize: 15,
    fontWeight: "500",
    color: "#111111",
  },
  blackAddCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#2563EB",
    justifyContent: "center",
    alignItems: "center",
  },
  applyPillBtn: {
    height: 56,
    borderRadius: 28,
    backgroundColor: "#2563EB",
    justifyContent: "center",
    alignItems: "center",
  },
  applyPillBtnText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#FFFFFF",
  },
  whatOptionsList: {
    gap: 12,
  },
  whatCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#EEF2F6",
    padding: 16,
  },
  whatIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  whatCardTitle: {
    fontSize: 15,
    fontWeight: "500",
    color: "#111111",
    marginBottom: 3,
  },
  whatCardDesc: {
    fontSize: 12,
    color: "#64748B",
    lineHeight: 17,
    fontWeight: "400",
  },
  stepTitle: {
    fontSize: 20,
    fontWeight: "500",
    color: COLORS.textDark,
    marginBottom: 4,
  },
  stepSub: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginBottom: 20,
    lineHeight: 18,
    fontWeight: "400",
  },
  fieldHeading: {
    fontSize: 14,
    fontWeight: "500",
    color: COLORS.textDark,
    marginTop: 10,
    marginBottom: 10,
  },
  segmentedRow: {
    flexDirection: "row",
    backgroundColor: "#E2E8F0",
    borderRadius: 12,
    padding: 3,
    marginBottom: 16,
  },
  chipsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 16,
  },
  formRow: {
    flexDirection: "row",
  },
  mapCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#EEF2F6",
    overflow: "hidden",
    marginBottom: 20,
  },
  mapVisualBox: {
    height: 120,
    backgroundColor: "#EFF6FF",
    justifyContent: "center",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#DBEAFE",
  },
  mapVisualTitle: {
    fontSize: 14,
    fontWeight: "500",
    color: COLORS.textDark,
    marginTop: 6,
  },
  mapVisualSub: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 2,
    fontWeight: "400",
  },
  setMapBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
  },
  setMapBtnText: {
    fontSize: 13,
    fontWeight: "500",
    color: COLORS.primary,
  },
  previewCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#EEF2F6",
    overflow: "hidden",
  },
  previewHero: {
    height: 200,
    position: "relative",
  },
  previewHeroImage: {
    width: "100%",
    height: "100%",
  },
  previewBadgePill: {
    position: "absolute",
    top: 14,
    left: 14,
    backgroundColor: "rgba(15, 23, 42, 0.8)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  previewBadgeText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "500",
  },
  previewContent: {
    padding: 18,
  },
  previewTitle: {
    fontSize: 19,
    fontWeight: "500",
    color: COLORS.textDark,
  },
  previewLocRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
    marginBottom: 8,
  },
  previewLocText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    fontWeight: "400",
  },
  previewPrice: {
    fontSize: 22,
    fontWeight: "500",
    color: COLORS.primary,
    marginBottom: 12,
  },
  previewSpecsRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 16,
  },
  previewSpecPill: {
    backgroundColor: "#F1F5F9",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  previewSpecPillText: {
    fontSize: 12,
    fontWeight: "500",
    color: COLORS.textDark,
  },
  previewSection: {
    paddingTop: 14,
    marginTop: 14,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
  },
  previewSectionTitle: {
    fontSize: 14,
    fontWeight: "500",
    color: COLORS.textDark,
    marginBottom: 6,
  },
  previewDescText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 19,
    fontWeight: "400",
  },
  specDetailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 4,
  },
  specDetailKey: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: "400",
  },
  specDetailVal: {
    fontSize: 12,
    fontWeight: "500",
    color: COLORS.textDark,
  },
  amenityChipPreview: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginRight: 6,
    marginBottom: 6,
  },
  amenityChipPreviewText: {
    fontSize: 11,
    fontWeight: "500",
    color: COLORS.textDark,
  },
  bottomBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: Platform.OS === "ios" ? 28 : 16,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#EEF2F6",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 8,
  },
  primaryPillBtn: {
    flex: 1,
    height: 54,
    borderRadius: 27,
    backgroundColor: "#2563EB",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    shadowColor: "#2563EB",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 3,
  },
  primaryPillBtnText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#FFFFFF",
    letterSpacing: 0.2,
  },
  secondaryPillBtn: {
    height: 54,
    borderRadius: 27,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
    flexDirection: "row",
  },
  secondaryPillBtnText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#111111",
  },
  backBtnPill: {
    height: 54,
    paddingHorizontal: 20,
    borderRadius: 27,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
    flexDirection: "row",
    marginRight: 10,
  },
  editStepBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EFF6FF",
    borderWidth: 1,
    borderColor: "#BFDBFE",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  editStepBtnText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#2563EB",
  },
});
