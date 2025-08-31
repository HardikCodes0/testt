import { CCard, CCardBody, CCardHeader, CCardText, CCardTitle, CCol, CContainer, CLink, CLoadingButton, CRow } from '@coreui/react-pro';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import GaugeChart from 'react-gauge-chart';
import CampaignList from '../../components/campaigns/List';
import { hasServiceRights, isSuperAdmin } from '../../utils/rights';
import { GRAPH_COLORS } from '../../utils/constant';
import campaignLogo from '../../assets/brand/campaign.png';
import users from '../../assets/brand/group.png';
import vulnerableUsers from '../../assets/brand/online-training.png';
import phishingTemplates from '../../assets/brand/phishing.png';

import {
    fetchCustomerRiskScore,
    fetchTrainingCompliance,
    fetchCampaignCount,
    fetchLanguageCount,
    fetchActiveUserCount,
    fetchCampaignWiseReport,
    fetchLiveCampaigns,
    fetchPhishingTemplateCount,
    fetchVulnerableUserCount,
    fetchTrainingModulesCount,
    exportCampaignReport,
} from './actions';

import CIcon from '@coreui/icons-react';
import { cilArrowCircleBottom, cilBarChart, cilChevronRight, cilBullhorn, cilPeople, cilBook, cilShieldAlt } from '@coreui/icons';
import LineChart from 'src/components/utils/LineChart';
import moment from 'moment';

import { CircularProgressbarWithChildren, buildStyles } from 'react-circular-progressbar';
import { toastr } from 'react-redux-toastr';
import CampaignSVG from 'src/assets/icons/campaigns';
import UserSVG from 'src/assets/icons/users';
import TrainingSVG from 'src/assets/icons/training';
import EmailTemplateSVG from 'src/assets/icons/email-templates';

const customStyles = {
    actionButton: { fontSize: 12, width: 150, color: 'white' },
};

const riskScoreScolor = (riskScore) => {
    if (riskScore < 25) {
        return GRAPH_COLORS.GREEN;
    } else if (riskScore < 50) {
        return GRAPH_COLORS.YELLOW;
    } else {
        return GRAPH_COLORS.RED;
    }
};

const riskScoreText = (riskScore) => {
    if (riskScore < 25) {
        return 'Low';
    } else if (riskScore < 50) {
        return 'Medium';
    } else {
        return 'High';
    }
};

const SuperAdminDashboard = () => {
    return <>Hello World</>;
};

const TrainingStats = (props) => {
    const { campaignsReport, trainingCompliance } = props;
    return (
        <CCard className='mt-10'>
            <CRow>
                <CCol sm={6} lg={5}>
                    <CCard className=' d-flex-center' style={{ height: '100%', borderRadius: 0 }}>
                        <CCardHeader style={{ width: '100%' }}>Training Compliance Level</CCardHeader>
                        <CCardBody style={{ width: '500px', height: '300px' }}>
                            {campaignsReport.length == 0 ? (
                                <div className='d-flex-center' style={{ height: 400 }}>
                                    <div className='text-center'>
                                        <CIcon icon={cilBarChart} />
                                        <p>No report to show</p>
                                    </div>
                                </div>
                            ) : (
                                <GaugeChart
                                    id='gauge-chart6'
                                    style={{ width: '100%' }}
                                    textColor={'#464a50'}
                                    colors={[GRAPH_COLORS.RED, GRAPH_COLORS.YELLOW, GRAPH_COLORS.GREEN]}
                                    animate={false}
                                    nrOfLevels={30}
                                    percent={trainingCompliance / 100}
                                    needleColor='#345243'
                                    formatTextValue={(value) => value}
                                />
                            )}
                        </CCardBody>
                    </CCard>
                </CCol>
                <CCol sm={12} lg={7}>
                    <CCard style={{ paddingBottom: '10px', borderRadius: 0 }}>
                        <CCardHeader>Performance of Training Campaigns</CCardHeader>

                        {campaignsReport.length > 0 ? (
                            <CCardBody>
                                <LineChart
                                    labels={campaignsReport.map((elem) => moment(elem.createdAt).format('ll'))}
                                    datasets={[
                                        {
                                            label: 'Not Attempted',
                                            data: campaignsReport.map((elem) => elem.notStarted),
                                            color: GRAPH_COLORS.RED,
                                        },
                                        {
                                            label: 'Passed',
                                            data: campaignsReport.map((elem) => elem.passed),
                                            color: GRAPH_COLORS.GREEN,
                                        },
                                        {
                                            label: 'Attempted but Failed',
                                            data: campaignsReport.map((elem) => elem.failed),
                                            color: GRAPH_COLORS.YELLOW,
                                        },
                                    ]}
                                />
                            </CCardBody>
                        ) : (
                            <CCardBody className='d-flex-center' style={{ height: 400 }}>
                                <div className='text-center'>
                                    <CIcon icon={cilBarChart} />
                                    <p>No report to show</p>
                                </div>
                            </CCardBody>
                        )}
                    </CCard>
                </CCol>
            </CRow>
        </CCard>
    );
};

const PhishingStats = (props) => {
    const { campaignsReport, riskScore } = props;
    return (
        <CRow className='mt-4' style={{ gap: '1.5rem' }}>
            <CCol sm={6} lg={5}>
                <CCard 
                    className='d-flex-center' 
                    style={{ 
                        height: '100%', 
                        borderRadius: '16px',
                        background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
                        border: '1px solid #e2e8f0',
                        position: 'relative',
                        overflow: 'hidden',
                        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.08)'
                    }}
                >
                    {/* Decorative floating circles */}
                    <div style={{
                        position: 'absolute',
                        top: '-50px',
                        right: '-50px',
                        width: '100px',
                        height: '100px',
                        borderRadius: '50%',
                        background: 'rgba(148, 163, 184, 0.1)',
                        zIndex: 1
                    }} />
                    <div style={{
                        position: 'absolute',
                        bottom: '-30px',
                        left: '-30px',
                        width: '60px',
                        height: '60px',
                        borderRadius: '50%',
                        background: 'rgba(148, 163, 184, 0.08)',
                        zIndex: 1
                    }} />
                    
                    <CCardHeader 
                        style={{ 
                            width: '100%',
                            background: 'transparent',
                            border: 'none',
                            color: '#374151',
                            fontWeight: '600',
                            textAlign: 'center',
                            padding: '1.5rem 1.5rem 1rem',
                            zIndex: 2,
                            position: 'relative'
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                            <CIcon icon={cilShieldAlt} style={{ width: '20px', height: '20px', color: '#6b7280' }} />
                            Organization Risk Score
                        </div>
                    </CCardHeader>
                    <CCardBody 
                        style={{ 
                            width: '100%', 
                            maxWidth: '280px',
                            height: '300px',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '1.5rem',
                            zIndex: 2,
                            position: 'relative'
                        }}
                    >
                        {campaignsReport.length == 0 ? (
                            <div className='d-flex-center' style={{ height: 400, color: '#374151' }}>
                                <div className='text-center'>
                                    <div style={{
                                        width: '60px',
                                        height: '60px',
                                        borderRadius: '50%',
                                        background: 'rgba(148, 163, 184, 0.2)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        margin: '0 auto 1rem'
                                    }}>
                                        <CIcon icon={cilBarChart} style={{ color: '#6b7280', fontSize: '24px' }} />
                                    </div>
                                    <p style={{ color: '#374151', fontWeight: '500', margin: '0.5rem 0 0' }}>No report to show</p>
                                    <p style={{ color: '#6B7280', fontSize: '0.875rem', margin: '0.25rem 0 0' }}>Start a campaign to see risk data</p>
                                </div>
                            </div>
                        ) : (
                            <>
                                <GaugeChart
                                    id='gauge-chart6'
                                    style={{ width: '100%' }}
                                    textColor={'#374151'}
                                    animate={true}
                                    animateDuration={2000}
                                    nrOfLevels={30}
                                    percent={riskScore / 100}
                                    needleColor='#6b7280'
                                    formatTextValue={(value) => `${value}%`}
                                />
                                <div style={{
                                    textAlign: 'center',
                                    marginTop: '1rem',
                                    color: '#374151'
                                }}>
                                    <div style={{
                                        fontSize: '1.125rem',
                                        fontWeight: '600',
                                        marginBottom: '0.25rem'
                                    }}>
                                        Risk Level: {riskScoreText(riskScore)}
                                    </div>
                                </div>
                            </>
                        )}
                    </CCardBody>
                </CCard>
            </CCol>
            <CCol sm={12} lg={7}>
                <CCard style={{ 
                    paddingBottom: '10px', 
                    borderRadius: '16px',
                    border: 'none',
                    height: '100%',
                    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.08)'
                }}>
                    <CCardHeader style={{
                        background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.05) 100%)',
                        border: 'none',
                        borderBottom: '1px solid rgba(102, 126, 234, 0.1)',
                        padding: '1.5rem',
                        fontWeight: '600',
                        color: '#374151'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <CIcon icon={cilBarChart} style={{ width: '20px', height: '20px', color: '#667eea' }} />
                            Campaign History
                        </div>
                    </CCardHeader>

                    {campaignsReport.length > 0 ? (
                        <CCardBody style={{ padding: '1.5rem' }}>
                            <div style={{
                                background: 'rgba(102, 126, 234, 0.02)',
                                borderRadius: '12px',
                                padding: '1.5rem',
                                border: '1px solid rgba(102, 126, 234, 0.08)'
                            }}>
                                <LineChart
                                    labels={campaignsReport.map((elem) => moment(elem.createdAt).format('ll'))}
                                    datasets={[
                                        {
                                            label: 'Phishing Link Clicked',
                                            data: campaignsReport.map((elem) => elem.defaulters),
                                            color: GRAPH_COLORS.RED,
                                        },
                                        {
                                            label: 'Email Not Opened',
                                            data: campaignsReport.map((elem) => elem.targets - elem.opened),
                                            color: GRAPH_COLORS.GREEN,
                                        },
                                        {
                                            label: 'Email Opened Not Clicked',
                                            data: campaignsReport.map((elem) => elem.opened - elem.defaulters),
                                            color: GRAPH_COLORS.YELLOW,
                                        },
                                    ]}
                                />
                            </div>
                        </CCardBody>
                    ) : (
                        <CCardBody className='d-flex-center' style={{ height: 400, padding: '1.5rem' }}>
                            <div className='text-center'>
                                <div style={{
                                    width: '60px',
                                    height: '60px',
                                    borderRadius: '50%',
                                    background: 'rgba(102, 126, 234, 0.1)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    margin: '0 auto 1rem'
                                }}>
                                    <CIcon icon={cilBarChart} style={{ color: '#667eea', fontSize: '24px' }} />
                                </div>
                                <p style={{ color: '#374151', fontWeight: '500', margin: '0.5rem 0 0' }}>No report to show</p>
                                <p style={{ color: '#6B7280', fontSize: '0.875rem', margin: '0.25rem 0 0' }}>Campaign data will appear here once available</p>
                            </div>
                        </CCardBody>
                    )}
                </CCard>
            </CCol>
        </CRow>
    );
};

const ClientDashboard = (props) => {
    const dispatch = useDispatch();
    const [downloading, setDownloading] = useState(false);
    const currentCustomer = useSelector((state) => state.customer?.currentCustomer);
    const { campaignsCount, employeesCount, trainingLangCount, trainingModulesCount, templatesCount, campaigns, campaignsReport, riskScore, trainingCompliance } = useSelector(
        (state) => state.dashboard
    );

    const { user } = props;
    const percentage = 66;

    const columns = [
        // { key: 'campaignType', label: 'Campaign Type' },
        { key: 'name', label: 'Campaign' },
        { key: 'createdAt', label: 'Launch Date' },
        { key: 'expireAt', label: 'Valid Till' },
        { key: 'targets', label: 'Delivered' },
        hasServiceRights('training', currentCustomer) && !hasServiceRights('email', currentCustomer)
            ? { key: 'passed', label: 'Users who passed' }
            : { key: 'defaulters', label: 'Phished' },
        // { key: 'show_details', label: 'Details' },
        { key: 'actions', label: 'Actions' },
    ];

    useEffect(() => {
        if (currentCustomer) {
            fetchCustomerRiskScore({ customerId: currentCustomer._id }, dispatch);
            fetchTrainingCompliance({ customerId: currentCustomer._id }, dispatch);
            fetchCampaignCount({ customerId: currentCustomer._id, status: 'active' }, dispatch);
            fetchLanguageCount({ customerId: currentCustomer._id }, dispatch);
            fetchVulnerableUserCount({ customerId: currentCustomer._id, clicked: true }, dispatch);
            fetchActiveUserCount({ customerId: currentCustomer._id }, dispatch);
            fetchTrainingModulesCount({ customerId: currentCustomer._id }, dispatch);
            fetchPhishingTemplateCount({ customerId: currentCustomer._id }, dispatch);
            fetchLiveCampaigns({ customerId: currentCustomer._id, status: 'active' }, dispatch);
            fetchCampaignWiseReport({ customerId: currentCustomer._id }, dispatch);
        }
    }, [currentCustomer]);

    useEffect(() => {
        if (campaignsReport) {
            console.log(campaignsReport);
        }
    }, [campaignsReport]);

    const downloadReport = async () => {
        try {
            setDownloading(true);
            await exportCampaignReport({ customerId: currentCustomer._id, status: 'active' });
            setDownloading(false);
        } catch (err) {
            setDownloading(false);
            console.log(err);
            toastr.error('Error!', 'Something went wrong while exporting users, please wait or refresh your page.');
        }
    };

    const onReload = () => {
        if (currentCustomer) {
            fetchCampaignCount({ customerId: currentCustomer._id, status: 'active' }, dispatch);
            fetchLiveCampaigns({ customerId: currentCustomer._id, status: 'active' }, dispatch);
            fetchCampaignWiseReport({ customerId: currentCustomer._id }, dispatch);
        }
    };

    return (
        <CContainer fluid>
            {/* Modern Greeting Section */}
            <div className="border-bottom border-gray-200" style={{ backgroundColor: '#EBEDEF' }}>
                <div className="px-4 py-4">
                    <div className="mb-4">
                        <h1 style={{ fontSize: '1.875rem', fontWeight: '700', color: '#111827', marginBottom: '0.5rem' }}>
                            Greetings again, {user.fullName}
                        </h1>
                        <p style={{ fontSize: '1.125rem', color: '#4B5563' }}>
                            Here's your security overview for today
                        </p>
                    </div>
                </div>
            </div>

            {/* Modern Card Layout */}
            <CRow className="g-4">
                {/* Live Campaigns Card */}
                <CCol xs={12} md={6} lg={3}>
                    <CCard className="stat-card border-0 shadow-sm"
                        style={{ backgroundColor: '#EFF6FF', borderRadius: '0.75rem', transition: 'all 0.3s', border: 'none !important', minHeight: 'auto' }}>
                        <CCardBody className="d-flex justify-content-between align-items-center p-3">
                            <CLink className='d-flex align-items-center text-decoration-none w-100' href='/campaigns'>
                                <div className="d-flex align-items-center flex-grow-1">
                                    <div style={{
                                        padding: '0.75rem',
                                        backgroundColor: '#DBEAFE',
                                        borderRadius: '0.5rem',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        <CIcon icon={cilBullhorn} style={{ width: '24px', height: '24px', color: '#2563EB' }} />
                                    </div>
                                    <div style={{ marginLeft: '1rem' }}>
                                        <div className="stat-number">
                                            {campaignsCount.active}
                                        </div>
                                        <div className="stat-label">
                                            Live Campaigns
                                        </div>
                                    </div>
                                </div>
                                <CIcon icon={cilChevronRight} style={{ width: '20px', height: '20px', color: '#9CA3AF' }}
                                    className="chevron-hover" />
                            </CLink>
                        </CCardBody>
                    </CCard>
                </CCol>

                {/* Active Users Card */}
                <CCol xs={12} md={6} lg={3}>
                    <CCard className="stat-card border-0 shadow-sm"
                        style={{ backgroundColor: '#ECFDF5', borderRadius: '0.75rem', transition: 'all 0.3s', border: 'none !important', minHeight: 'auto' }}>
                        <CCardBody className="d-flex justify-content-between align-items-center p-3">
                            <CLink className='d-flex align-items-center text-decoration-none w-100' href='/address-book'>
                                <div className="d-flex align-items-center flex-grow-1">
                                    <div style={{
                                        padding: '0.75rem',
                                        backgroundColor: '#D1FAE5',
                                        borderRadius: '0.5rem',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        <CIcon icon={cilPeople} style={{ width: '24px', height: '24px', color: '#059669' }} />
                                    </div>
                                    <div style={{ marginLeft: '1rem' }}>
                                        <div className="stat-number">
                                            {employeesCount}
                                        </div>
                                        <div className="stat-label">
                                            Active Users
                                        </div>
                                    </div>
                                </div>
                                <CIcon icon={cilChevronRight} style={{ width: '20px', height: '20px', color: '#9CA3AF' }}
                                    className="chevron-hover" />
                            </CLink>
                        </CCardBody>
                    </CCard>
                </CCol>

                {/* Training Modules Card */}
                <CCol xs={12} md={6} lg={3}>
                    <CCard className="stat-card border-0 shadow-sm"
                        style={{ backgroundColor: '#F5F3FF', borderRadius: '0.75rem', transition: 'all 0.3s', border: 'none !important', minHeight: 'auto' }}>
                        <CCardBody className="d-flex justify-content-between align-items-center p-3">
                            <CLink className='d-flex align-items-center text-decoration-none w-100' href='/training-modules'>
                                <div className="d-flex align-items-center flex-grow-1">
                                    <div style={{
                                        padding: '0.75rem',
                                        backgroundColor: '#EDE9FE',
                                        borderRadius: '0.5rem',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        <CIcon icon={cilBook} style={{ width: '24px', height: '24px', color: '#7C3AED' }} />
                                    </div>
                                    <div style={{ marginLeft: '1rem' }}>
                                        <div className="stat-number">
                                            {trainingModulesCount}
                                        </div>
                                        <div className="stat-label">
                                            Training Modules
                                        </div>
                                    </div>
                                </div>
                                <CIcon icon={cilChevronRight} style={{ width: '20px', height: '20px', color: '#9CA3AF' }}
                                    className="chevron-hover" />
                            </CLink>
                        </CCardBody>
                    </CCard>
                </CCol>

                {/* Conditional Fourth Card */}
                {hasServiceRights('training', currentCustomer) && !hasServiceRights('email', currentCustomer) ? (
                    <CCol xs={12} md={6} lg={3}>
                        <CCard className="stat-card border-0 shadow-sm"
                                style={{ backgroundColor: '#F5F3FF', borderRadius: '0.75rem', transition: 'all 0.3s', border: 'none !important', minHeight: 'auto' }}>
                            <CCardBody className="d-flex justify-content-between align-items-center p-3">
                                <CLink className='d-flex align-items-center text-decoration-none w-100' href='/training-modules'>
                                    <div className="d-flex align-items-center flex-grow-1">
                                        <div style={{
                                            padding: '0.75rem',
                                            backgroundColor: '#EDE9FE',
                                            borderRadius: '0.5rem',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}>
                                            <CIcon icon={cilBook} style={{ width: '24px', height: '24px', color: '#7C3AED' }} />
                                        </div>
                                        <div style={{ marginLeft: '1rem' }}>
                                            <div className="stat-number">
                                                {trainingLangCount}
                                            </div>
                                            <div className="stat-label">
                                                Available Languages
                                            </div>
                                        </div>
                                    </div>
                                    <CIcon icon={cilChevronRight} style={{ width: '20px', height: '20px', color: '#9CA3AF' }}
                                            className="chevron-hover" />
                                </CLink>
                            </CCardBody>
                        </CCard>
                    </CCol>
                ) : (
                    <CCol xs={12} md={6} lg={3}>
                        <CCard className="stat-card border-0 shadow-sm"
                                style={{ backgroundColor: '#FFF7ED', borderRadius: '0.75rem', transition: 'all 0.3s', border: 'none !important', minHeight: 'auto' }}>
                            <CCardBody className="d-flex justify-content-between align-items-center p-3">
                                <CLink className='d-flex align-items-center text-decoration-none w-100' href='/email/templates'>
                                    <div className="d-flex align-items-center flex-grow-1">
                                        <div style={{
                                            padding: '0.75rem',
                                            backgroundColor: '#FFEDD5',
                                            borderRadius: '0.5rem',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}>
                                            <CIcon icon={cilShieldAlt} style={{ width: '24px', height: '24px', color: '#EA580C' }} />
                                        </div>
                                        <div style={{ marginLeft: '1rem' }}>
                                            <div className="stat-number">
                                                {templatesCount}
                                            </div>
                                            <div className="stat-label">
                                                Phishing Material
                                            </div>
                                        </div>
                                    </div>
                                    <CIcon icon={cilChevronRight} style={{ width: '20px', height: '20px', color: '#9CA3AF' }}
                                            className="chevron-hover" />
                                </CLink>
                            </CCardBody>
                        </CCard>
                    </CCol>
                )}
            </CRow>

            {hasServiceRights('training', currentCustomer) && !hasServiceRights('email', currentCustomer) ? (
                <TrainingStats campaignsReport={campaignsReport} trainingCompliance={trainingCompliance} />
            ) : (
                <PhishingStats campaignsReport={campaignsReport} riskScore={riskScore} />
            )}

            <CRow className='mt-4'>
                <CCol>
                    <CCard style={{
                        borderRadius: '16px',
                        border: 'none',
                        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.08)',
                        overflow: 'hidden'
                    }}>
                        <CCardHeader style={{
                            background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.05) 100%)',
                            border: 'none',
                            borderBottom: '1px solid rgba(102, 126, 234, 0.1)',
                            padding: '1.5rem',
                            fontWeight: '600',
                            color: '#374151'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <CIcon icon={cilBullhorn} style={{ width: '20px', height: '20px', color: '#667eea' }} />
                                    {hasServiceRights('training', currentCustomer) && !hasServiceRights('email', currentCustomer)
                                        ? 'Realtime Awareness Training Campaigns'
                                        : 'Real-Time Phishing Campaigns'}
                                </div>
                                <CLoadingButton
                                    onClick={downloadReport}
                                    loading={downloading}
                                    color='info'
                                    style={{
                                        fontSize: '0.875rem',
                                        fontWeight: '500',
                                        padding: '0.5rem 1rem',
                                        borderRadius: '8px',
                                        border: 'none',
                                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                        color: 'white',
                                        boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
                                        transition: 'all 0.3s ease'
                                    }}
                                    disabled={campaigns.length == 0}
                                >
                                    <CIcon icon={cilArrowCircleBottom} style={{ marginRight: '0.5rem' }} /> Export
                                </CLoadingButton>
                            </div>
                        </CCardHeader>
                        <CCardBody style={{
                            padding: '1.5rem',
                            background: 'rgba(248, 250, 252, 0.5)'
                        }}>
                            <div style={{
                                background: 'white',
                                borderRadius: '12px',
                                padding: '1rem',
                                border: '1px solid rgba(226, 232, 240, 0.8)',
                                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)'
                            }}>
                                <CampaignList columns={columns} items={campaigns} onReload={onReload} />
                            </div>
                        </CCardBody>
                    </CCard>
                </CCol>
            </CRow>
        </CContainer>
    );
};

const Dashboard = () => {
    const user = useSelector((state) => state.user?.userData?.user);

    return isSuperAdmin(user) ? <SuperAdminDashboard user={user} /> : <ClientDashboard user={user} />;
};

export default Dashboard;
