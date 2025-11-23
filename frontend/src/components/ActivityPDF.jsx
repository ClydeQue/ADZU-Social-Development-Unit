import { Document, Page, Text, View, StyleSheet, Image, Font } from '@react-pdf/renderer';
import PropTypes from 'prop-types';

// Register fonts
Font.register({
  family: 'Times New Roman',
  src: 'https://fonts.gstatic.com/s/timesnewroman/v1/3Gg8L-Q7ShZJmGqTfepd4gNPxVXBH_Y.ttf',
});

Font.register({
  family: 'Inter',
  fonts: [
    { src: 'https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2' },
    { src: 'https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuGKYAZ9hiA.woff2', fontWeight: 'bold' },
  ]
});

// Create styles for PDF
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 11,
    fontFamily: 'Inter',
    backgroundColor: '#FFFFFF',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
    paddingBottom: 15,
    borderBottom: '2 solid #040195',
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
    fontFamily: 'Times New Roman',
    fontWeight: 'bold',
    color: '#040195',
    textAlign: 'center',
    marginBottom: 4,
  },
  universitySubtitle: {
    fontSize: 9,
    fontFamily: 'Times New Roman',
    fontStyle: 'italic',
    color: '#666666',
    textAlign: 'center',
    marginBottom: 3,
  },
  unitName: {
    fontSize: 11,
    fontFamily: 'Times New Roman',
    fontWeight: 'bold',
    color: '#040195',
    textAlign: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Inter',
    color: '#040195',
    marginBottom: 5,
    marginTop: 10,
  },
  subtitle: {
    fontSize: 10,
    fontFamily: 'Inter',
    color: '#666666',
    marginBottom: 3,
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    fontFamily: 'Inter',
    color: '#040195',
    marginBottom: 8,
    borderBottom: '1 solid #E5E7EB',
    paddingBottom: 4,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  label: {
    width: '30%',
    fontWeight: 'bold',
    fontFamily: 'Inter',
    color: '#374151',
  },
  value: {
    width: '70%',
    fontFamily: 'Inter',
    color: '#1F2937',
  },
  badge: {
    display: 'inline-block',
    padding: '4 8',
    borderRadius: 4,
    fontSize: 9,
    fontWeight: 'bold',
    fontFamily: 'Inter',
    marginRight: 4,
    marginBottom: 4,
  },
  statusBadge: {
    backgroundColor: '#E0E7FF',
    color: '#4338CA',
    padding: '6 12',
    borderRadius: 6,
    fontSize: 10,
    fontWeight: 'bold',
    fontFamily: 'Inter',
    textTransform: 'uppercase',
  },
  sdgContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 5,
  },
  sdgBadge: {
    backgroundColor: '#F3F4F6',
    padding: '4 8',
    borderRadius: 4,
    fontSize: 9,
    fontFamily: 'Inter',
    color: '#040195',
    marginRight: 6,
    marginBottom: 4,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: 'center',
    fontSize: 9,
    fontFamily: 'Inter',
    color: '#9CA3AF',
    borderTop: '1 solid #E5E7EB',
    paddingTop: 10,
  },
  textBlock: {
    marginBottom: 4,
    fontFamily: 'Inter',
    color: '#1F2937',
    lineHeight: 1.4,
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

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'Not set';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header with Logos */}
        <View style={styles.headerContainer}>
          {/* Left Logo */}
          <View style={styles.headerLeft}>
            <Image
              src={`${window.location.origin}/logos/pdflogo/adzu_logo_print.webp`}
              style={styles.logo}
            />
          </View>

          {/* Center Text */}
          <View style={styles.headerCenter}>
            <Text style={styles.universityName}>Ateneo de Zamboanga University</Text>
            <Text style={styles.universitySubtitle}>
              The Jesuit University in Western Mindanao, Philippines
            </Text>
            <Text style={styles.unitName}>SOCIAL DEVELOPMENT UNIT</Text>
          </View>

          {/* Right Logo */}
          <View style={styles.headerRight}>
            <Image
              src={`${window.location.origin}/logos/pdflogo/sdu_logo_pdf.webp`}
              style={styles.logo}
            />
          </View>
        </View>

        {/* Activity Title */}
        <Text style={styles.title}>{activity?.title || 'Activity Report'}</Text>
        <Text style={styles.subtitle}>
          {activity?.programs?.offices?.name || 'Office'} - Activity Report
        </Text>
        <Text style={styles.subtitle}>
          Generated on: {new Date().toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </Text>

        {/* Activity Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Activity Information</Text>
          
          <View style={styles.row}>
            <Text style={styles.label}>Office:</Text>
            <Text style={styles.value}>{activity?.programs?.offices?.name || 'N/A'}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Program:</Text>
            <Text style={styles.value}>{activity?.programs?.name || 'N/A'}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Status:</Text>
            <Text style={[styles.value, { textTransform: 'capitalize' }]}>
              {activity?.status || 'Pending'}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Start Date:</Text>
            <Text style={styles.value}>{formatDate(activity?.start_date)}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>End Date:</Text>
            <Text style={styles.value}>{formatDate(activity?.end_date)}</Text>
          </View>
        </View>

        {/* Objectives */}
        {activity?.objectives && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Objectives</Text>
            <Text style={styles.textBlock}>{activity.objectives}</Text>
          </View>
        )}

        {/* SDG Goals */}
        {sdgNumbers.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Sustainable Development Goals (SDG)</Text>
            <View style={styles.sdgContainer}>
              {sdgNumbers.map((sdg, index) => (
                <Text key={index} style={styles.sdgBadge}>
                  SDG {sdg}
                </Text>
              ))}
            </View>
          </View>
        )}

        {/* Venue */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Venue</Text>
          <Text style={styles.textBlock}>
            {[venueData.street, venueData.barangay, venueData.city, venueData.province]
              .filter(Boolean)
              .join(', ') || 'Not specified'}
          </Text>
        </View>

        {/* Participants */}
        {activity?.participants && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Participants</Text>
            <Text style={styles.textBlock}>{activity.participants}</Text>
          </View>
        )}

        {/* Partners */}
        {activity?.partners && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Partners</Text>
            <Text style={styles.textBlock}>{activity.partners}</Text>
          </View>
        )}

        {/* Budget */}
        {activity?.budget && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Budget</Text>
            <Text style={styles.textBlock}>
              ₱{parseFloat(activity.budget).toLocaleString('en-US', { 
                minimumFractionDigits: 2,
                maximumFractionDigits: 2 
              })}
            </Text>
          </View>
        )}

        {/* Report Information */}
        {report && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Report Details</Text>
            
            <View style={styles.row}>
              <Text style={styles.label}>Submitted:</Text>
              <Text style={styles.value}>{formatDate(report.created_at)}</Text>
            </View>

            {report.report_url && (
              <View style={styles.row}>
                <Text style={styles.label}>Report Link:</Text>
                <Text style={[styles.value, { color: '#4D49FC' }]}>
                  {report.report_url}
                </Text>
              </View>
            )}
          </View>
        )}

        {/* Footer */}
        <View style={styles.footer}>
          <Text>Social Development Unit - Ateneo de Zamboanga University</Text>
          <Text>This document was generated automatically</Text>
        </View>
      </Page>
    </Document>
  );
};

ActivityPDF.propTypes = {
  activity: PropTypes.object,
  report: PropTypes.object,
};

export default ActivityPDF;
