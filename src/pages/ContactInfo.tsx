import CrudPage from '../components/CrudPage';

export default function ContactInfo() {
  return (
    <CrudPage
      title="Contact Info"
      endpoint="contact-info"
      fields={[
        { key: 'country_id', label: 'Country ID', type: 'number' },
        { key: 'company_name_en', label: 'Company Name (EN)' },
        { key: 'company_name_ar', label: 'Company Name (AR)', hideInTable: true },
        { key: 'office_en', label: 'Office (EN)', hideInTable: true },
        { key: 'office_ar', label: 'Office (AR)', hideInTable: true },
        { key: 'floor_en', label: 'Floor (EN)', hideInTable: true },
        { key: 'floor_ar', label: 'Floor (AR)', hideInTable: true },
        { key: 'area_en', label: 'Area (EN)', hideInTable: true },
        { key: 'area_ar', label: 'Area (AR)', hideInTable: true },
        { key: 'city_en', label: 'City (EN)' },
        { key: 'city_ar', label: 'City (AR)', hideInTable: true },
        { key: 'address_en', label: 'Address (EN)', type: 'textarea', hideInTable: true },
        { key: 'address_ar', label: 'Address (AR)', type: 'textarea', hideInTable: true },
        { key: 'district_en', label: 'District (EN)', hideInTable: true },
        { key: 'district_ar', label: 'District (AR)', hideInTable: true },
        { key: 'province_en', label: 'Province (EN)', hideInTable: true },
        { key: 'province_ar', label: 'Province (AR)', hideInTable: true },
        { key: 'postal_code', label: 'Postal Code', hideInTable: true },
        { key: 'phone1', label: 'Phone 1' },
        { key: 'phone2', label: 'Phone 2', hideInTable: true },
        { key: 'email', label: 'Email' },
        { key: 'website', label: 'Website', hideInTable: true },
        { key: 'business_hours_en', label: 'Business Hours (EN)', hideInTable: true },
        { key: 'business_hours_ar', label: 'Business Hours (AR)', hideInTable: true },
        { key: 'is_head_office', label: 'Head Office', type: 'checkbox' },
        { key: 'is_active', label: 'Active', type: 'checkbox' },
      ]}
    />
  );
}
