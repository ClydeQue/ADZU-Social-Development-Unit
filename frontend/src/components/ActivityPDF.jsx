import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import PropTypes from 'prop-types';

// Create styles for PDF
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 11,
    fontFamily: 'Helvetica',
    backgroundColor: '#FFFFFF',
  },
  header: {
    marginBottom: 20,
    borderBottom: '2 solid #040195',
    paddingBottom: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#040195',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 3,
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: 'bold',
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
    color: '#374151',
  },
  value: {
    width: '70%',
    color: '#1F2937',
  },
  badge: {
    display: 'inline-block',
    padding: '4 8',
    borderRadius: 4,
    fontSize: 9,
    fontWeight: 'bold',
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
    color: '#9CA3AF',
    borderTop: '1 solid #E5E7EB',
    paddingTop: 10,
  },
  textBlock: {
    marginBottom: 4,
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
        {/* Header */}
        <View style={styles.header}>
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
        </View>

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
