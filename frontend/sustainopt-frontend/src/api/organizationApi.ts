import api from "./axiosConfig";


// ============================================================
// Organization Model
// ============================================================

export interface Organization {

    id?: number;

    organizationName: string;

    industryType: string;

    employeeCount: number;

    facilityArea: number;

    sustainabilityBudget: number;

    country: string;
}


// ============================================================
// CREATE ORGANIZATION
// ============================================================

export const saveOrganization = async (
    organization: Organization
): Promise<Organization> => {

    const response = await api.post(
        "/organizations",
        {
            organizationName:
                organization.organizationName,

            industryType:
                organization.industryType.toUpperCase(),

            employeeCount:
                organization.employeeCount,

            facilityArea:
                organization.facilityArea,

            sustainabilityBudget:
                organization.sustainabilityBudget,

            country:
                organization.country,
        }
    );

    return response.data;
};


// ============================================================
// GET ALL ORGANIZATIONS
// ============================================================

export const getOrganizations = async (): Promise<Organization[]> => {

    const response = await api.get(
        "/organizations"
    );

    return response.data;
};


// ============================================================
// UPDATE ORGANIZATION
// ============================================================

export const updateOrganization = async (
    id: number,
    organization: Organization
): Promise<Organization> => {

    const response = await api.put(
        `/organizations/${id}`,
        {
            organizationName:
                organization.organizationName,

            industryType:
                organization.industryType.toUpperCase(),

            employeeCount:
                organization.employeeCount,

            facilityArea:
                organization.facilityArea,

            sustainabilityBudget:
                organization.sustainabilityBudget,

            country:
                organization.country,
        }
    );

    return response.data;
};


// ============================================================
// DELETE ORGANIZATION
// ============================================================

export const deleteOrganization = async (
    id: number
): Promise<void> => {

    await api.delete(
        `/organizations/${id}`
    );
};