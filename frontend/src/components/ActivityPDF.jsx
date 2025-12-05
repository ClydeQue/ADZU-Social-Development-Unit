import { Document, Page, Text, View, StyleSheet, Image, Font } from '@react-pdf/renderer';
import PropTypes from 'prop-types';
import { ADZU_STRATEGIC_GOALS } from '@/utils/strategicGoalsData';

// Register Matura font
Font.register({
  family: 'Matura',
  src: '/fonts/MATURASC_1.TTF'
});

// Create styles for PDF
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 11,
    fontFamily: 'Helvetica',
    backgroundColor: '#FFFFFF',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 30,
    paddingBottom: 15,
  },
  headerLeft: {
    flex: 1,
  },
  headerCenter: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerRight: {
    flex: 1,
    alignItems: 'flex-end',
  },
  logo: {
    width: 60,
    height: 60,
    objectFit: 'contain',
  },
  universityName: {
    fontSize: 18,
    fontFamily: 'Matura',
    fontWeight: 'bold',
    color: '#040195',
    textAlign: 'center',
    marginBottom: 4,
  },
  universitySubtitle: {
    fontSize: 9,
    fontFamily: 'Times-Roman',
    fontStyle: 'italic',
    color: '#666666',
    textAlign: 'center',
    marginBottom: 3,
  },
  unitName: {
    fontSize: 11,
    fontFamily: 'Times-Roman',
    fontWeight: 'bold',
    color: '#040195',
    textAlign: 'center',
  },
  officeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  officeLogo: {
    width: 30,
    height: 30,
    marginRight: 10,
  },
  officeName: {
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Helvetica',
    color: '#040195',
  },
  statusBadgeContainer: {
    alignSelf: 'flex-end',
    marginBottom: 15,
  },
  statusBadge: {
    backgroundColor: '#E0E7FF',
    color: '#4338CA',
    padding: '6 12',
    borderRadius: 6,
    fontSize: 9,
    fontWeight: 'bold',
    fontFamily: 'Helvetica',
    textTransform: 'uppercase',
  },
  inceptionBox: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  inceptionLabel: {
    fontSize: 9,
    fontFamily: 'Helvetica',
    color: '#374151',
    width: 100,
  },
  inceptionValue: {
    fontSize: 9,
    fontFamily: 'Helvetica',
    color: '#1F2937',
    fontWeight: 'bold',
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    fontFamily: 'Helvetica',
    color: '#040195',
    marginBottom: 10,
  },
  description: {
    fontSize: 10,
    fontFamily: 'Helvetica',
    color: '#374151',
    lineHeight: 1.4,
    marginBottom: 15,
  },
  divider: {
    borderBottom: '3 solid #000000',
    marginVertical: 15,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    fontFamily: 'Helvetica',
    color: '#040195',
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  sectionContent: {
    fontSize: 10,
    fontFamily: 'Helvetica',
    color: '#374151',
    lineHeight: 1.5,
    marginBottom: 15,
  },
  threeColumnRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  column: {
    flex: 1,
    paddingRight: 10,
  },
  columnTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    fontFamily: 'Helvetica',
    color: '#040195',
    marginBottom: 5,
    textTransform: 'uppercase',
  },
  columnContent: {
    fontSize: 9,
    fontFamily: 'Helvetica',
    color: '#374151',
    lineHeight: 1.4,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 3,
  },
  infoLabel: {
    fontSize: 9,
    fontFamily: 'Helvetica',
    color: '#374151',
    width: 80,
  },
  infoValue: {
    fontSize: 9,
    fontFamily: 'Helvetica',
    color: '#1F2937',
    flex: 1,
  },
  sdgList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 5,
  },
  sdgItem: {
    fontSize: 9,
    fontFamily: 'Helvetica',
    color: '#040195',
    marginRight: 8,
    marginBottom: 3,
  },
  partnersList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 5,
  },
  partnerBadge: {
    backgroundColor: '#F3F4F6',
    padding: '4 8',
    borderRadius: 4,
    fontSize: 8,
    fontFamily: 'Helvetica',
    color: '#374151',
    marginRight: 6,
    marginBottom: 4,
  },
  partnerType: {
    fontSize: 8,
    fontFamily: 'Helvetica',
    fontStyle: 'italic',
    color: '#9CA3AF',
  },
  budgetSection: {
    marginTop: 15,
  },
  budgetRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  budgetLabel: {
    fontSize: 10,
    fontFamily: 'Helvetica',
    color: '#374151',
  },
  budgetValue: {
    fontSize: 10,
    fontFamily: 'Helvetica',
    color: '#040195',
    fontWeight: 'bold',
  },
  strategicGoalsSection: {
    marginTop: 10,
  },
  strategicGoalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  strategicGoalIcon: {
    fontSize: 12,
    marginRight: 8,
  },
  strategicGoalTitle: {
    fontSize: 10,
    fontFamily: 'Helvetica',
    color: '#040195',
  },
});

/**
 * ActivityPDF Component
 * Generates a PDF document for activity/report details
 */
const ActivityPDF = ({ activity, report }) => {
  // Parse venue
  let venueData = { street: '', barangay: '', city: '', province: '' };
  if (activity?.venue) {
    try {
      venueData = typeof activity.venue === 'string' ? JSON.parse(activity.venue) : activity.venue;
    } catch (e) {
      console.error('Error parsing venue:', e);
    }
  }

  // Parse SDG numbers
  let sdgNumbers = [];
  if (activity?.sdg_number) {
    try {
      sdgNumbers = typeof activity.sdg_number === 'string' 
        ? JSON.parse(activity.sdg_number) 
        : Array.isArray(activity.sdg_number) 
        ? activity.sdg_number 
        : [activity.sdg_number];
    } catch (e) {
      console.error('Error parsing SDG numbers:', e);
    }
  }

  // Parse partners
  let partnersData = [];
  if (activity?.partners) {
    try {
      const partnersStr = typeof activity.partners === 'string' ? activity.partners : '';
      // Split by comma and create array
      partnersData = partnersStr.split(',').map(p => p.trim()).filter(Boolean);
    } catch (e) {
      console.error('Error parsing partners:', e);
    }
  }

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'Not set';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const formatDateShort = (dateString) => {
    if (!dateString) return 'Not set';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase();
  };

  // Get office acronym
  const officeAcronym = activity?.programs?.offices?.acronym || 'OFFICE';

  // Get SDG name
  const getSdgName = (sdgNum) => {
    const sdgNames = {
      1: 'No Poverty',
      2: 'Zero Hunger',
      3: 'Good Health and Well-being',
      4: 'Quality Education',
      5: 'Gender Equality',
      6: 'Clean Water and Sanitation',
      7: 'Affordable and Clean Energy',
      8: 'Decent Work and Economic Growth',
      9: 'Industry, Innovation and Infrastructure',
      10: 'Reduced Inequalities',
      11: 'Sustainable Cities and Communities',
      12: 'Responsible Consumption and Production',
      13: 'Climate Action',
      14: 'Life Below Water',
      15: 'Life on Land',
      16: 'Peace, Justice and Strong Institutions',
      17: 'Partnerships for the Goals'
    };
    return sdgNames[parseInt(sdgNum)] || '';
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header with Logos */}
        <View style={styles.headerContainer}>
          <View style={styles.headerLeft}>
            <Image
              src="/logos/pdflogo/adzu_logo_print.webp"
              style={styles.logo}
            />
          </View>
          <View style={styles.headerCenter}>
            <Text style={styles.universityName}>Ateneo de Zamboanga University</Text>
            <Text style={styles.universitySubtitle}>
              The Jesuit University in Western Mindanao, Philippines
            </Text>
            <Text style={styles.unitName}>SOCIAL DEVELOPMENT UNIT</Text>
          </View>
          <View style={styles.headerRight}>
            <Image
              src="/logos/pdflogo/sdu_logo_pdf.webp"
              style={styles.logo}
            />
          </View>
        </View>

        {/* Office Header with Logo and Status */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 15 }}>
          <View style={styles.officeHeader}>
            {officeAcronym && (
              <Image
                src={`/logos/officeLogoTransparent/${officeAcronym}.webp`}
                style={styles.officeLogo}
              />
            )}
            <Text style={styles.officeName}>{officeAcronym}</Text>
          </View>
          <View style={styles.statusBadgeContainer}>
            <Text style={styles.statusBadge}>{activity?.status?.toUpperCase() || 'NO STATUS'}</Text>
          </View>
        </View>

        {/* Inception and Implementation Dates */}
        <View style={{ marginBottom: 10 }}>
          <View style={styles.inceptionBox}>
            <Text style={styles.inceptionLabel}>INCEPTION</Text>
            <Text style={styles.inceptionValue}>: {formatDateShort(activity?.start_date)}</Text>
          </View>
          <View style={styles.inceptionBox}>
            <Text style={styles.inceptionLabel}>IMPLEMENTATION</Text>
            <Text style={styles.inceptionValue}>: {formatDateShort(activity?.end_date)}</Text>
          </View>
        </View>

        {/* Activity Title */}
        <Text style={styles.activityTitle}>{activity?.title || 'Untitled Activity'}</Text>

        {/* Description */}
        <Text style={styles.description}>
          {activity?.objectives || activity?.description || 'No description available.'}
        </Text>

        {/* Divider */}
        <View style={styles.divider} />

        {/* OBJECTIVES Section */}
        <Text style={styles.sectionTitle}>OBJECTIVES</Text>
        <Text style={styles.sectionContent}>
          {activity?.objectives || 'No objectives specified.'}
        </Text>

        {/* Divider */}
        <View style={styles.divider} />

        {/* SUSTAINABLE DEVELOPMENT GOALS */}
        <Text style={styles.sectionTitle}>SUSTAINABLE DEVELOPMENT GOALS</Text>
        {sdgNumbers.length > 0 ? (
          <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            {sdgNumbers.map((sdg, index) => (
              <View key={index} style={{ width: '50%', marginBottom: 5 }}>
                <Text style={styles.sdgItem}>
                  {index + 1}.  SDG {sdg}: {getSdgName(sdg)}
                </Text>
              </View>
            ))}
          </View>
        ) : (
          <Text style={styles.sectionContent}>No SDG goals specified.</Text>
        )}

        {/* Divider */}
        <View style={styles.divider} />

        {/* Three Column Layout: Venue, Participant Demographics, Sex Count */}
        <View style={styles.threeColumnRow}>
          {/* VENUE */}
          <View style={styles.column}>
            <Text style={styles.columnTitle}>VENUE</Text>
            <Text style={styles.columnContent}>
              {[venueData.street, venueData.barangay, venueData.city, venueData.province]
                .filter(Boolean)
                .join(', ') || 'Not specified'}
            </Text>
          </View>

          {/* PARTICIPANT DEMOGRAPHICS */}
          <View style={styles.column}>
            <Text style={styles.columnTitle}>PARTICIPANT DEMOGRAPHICS</Text>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>TOTAL</Text>
              <Text style={styles.infoValue}>: {activity?.participants || '0'}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>CLASSIFICATION</Text>
              <Text style={styles.infoValue}>: {activity?.classification || 'N/A'}</Text>
            </View>
          </View>

          {/* SEX COUNT */}
          <View style={styles.column}>
            <Text style={styles.columnTitle}>SEX COUNT</Text>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>MALE</Text>
              <Text style={styles.infoValue}>: {activity?.male_count || '0'}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>FEMALE</Text>
              <Text style={styles.infoValue}>: {activity?.female_count || '0'}</Text>
            </View>
          </View>
        </View>

        {/* Divider */}
        <View style={styles.divider} />

        {/* PARTNERS */}
        <Text style={styles.sectionTitle}>PARTNERS</Text>
        <View style={{ flexDirection: 'row', marginTop: 5 }}>
          {/* Government Column */}
          <View style={{ flex: 1, marginRight: 10 }}>
            <Text style={styles.partnerBadge}>Commission on Elections</Text>
            <Text style={styles.partnerType}>Government</Text>
          </View>
          {/* Non-Government Column */}
          <View style={{ flex: 1, marginRight: 10 }}>
            <Text style={styles.partnerBadge}>WeHope Foundation</Text>
            <Text style={styles.partnerType}>Non-Government</Text>
          </View>
          {/* Institutional Column */}
          <View style={{ flex: 1 }}>
            <Text style={styles.partnerBadge}>Beacon Publications</Text>
            <Text style={styles.partnerType}>Institutional</Text>
          </View>
        </View>
        <View style={{ flexDirection: 'row', marginTop: 8 }}>
          <View style={{ flex: 1, marginRight: 10 }}>
            <Text style={styles.partnerBadge}></Text>
            <Text style={styles.partnerType}>Resource-Sharing</Text>
          </View>
          <View style={{ flex: 1, marginRight: 10 }}>
            <Text style={styles.partnerBadge}></Text>
            <Text style={styles.partnerType}>Sponsorship</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.partnerBadge}></Text>
            <Text style={styles.partnerType}>Media Partner</Text>
          </View>
        </View>

        {/* Divider */}
        <View style={styles.divider} />

        {/* BUDGET OVERVIEW */}
        <Text style={styles.sectionTitle}>BUDGET OVERVIEW</Text>
        <View style={styles.budgetSection}>
          <View style={styles.budgetRow}>
            <Text style={styles.budgetLabel}>₱ {parseFloat(activity?.budget || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Text>
            <Text style={styles.budgetLabel}>External Fund</Text>
          </View>
        </View>

        {/* AdZU STRATEGIC GOALS */}
        {(() => {
          let strategicGoals = [];
          try {
            if (activity?.strategic_goals) {
              strategicGoals = typeof activity.strategic_goals === 'string'
                ? JSON.parse(activity.strategic_goals)
                : activity.strategic_goals;
            }
          } catch (e) {
            console.error('Error parsing strategic goals:', e);
          }
          
          if (strategicGoals && strategicGoals.length > 0) {
            return (
              <>
                <View style={styles.divider} />
                <Text style={styles.sectionTitle}>AdZU STRATEGIC GOALS</Text>
                <View style={styles.strategicGoalsSection}>
                  {strategicGoals.map((goalId) => {
                    const goal = ADZU_STRATEGIC_GOALS.find(g => g.id === goalId);
                    return goal ? (
                      <View key={goalId} style={styles.strategicGoalRow}>
                        <Text style={styles.strategicGoalIcon}>{goal.icon}</Text>
                        <Text style={styles.strategicGoalTitle}>{goal.title}</Text>
                      </View>
                    ) : null;
                  })}
                </View>
              </>
            );
          }
          return null;
        })()}
      </Page>
    </Document>
  );
};

ActivityPDF.propTypes = {
  activity: PropTypes.object,
  report: PropTypes.object,
};

export default ActivityPDF;
