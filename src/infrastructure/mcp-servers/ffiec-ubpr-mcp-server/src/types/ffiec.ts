export interface FFIECCredentials {
  username: string;
  password: string;
}

export interface FFIECServiceConfig {
  url: string;
  timeout: number;
  retryAttempts: number;
  rateLimit: {
    requestsPerMinute: number;
    requestsPerHour: number;
  };
}

export interface UBPRReportingPeriod {
  reportingPeriod: string;
  description: string;
  startDate: string;
  endDate: string;
}

export interface BankReporter {
  rssdId: string;
  bankName: string;
  city: string;
  state: string;
  filingDate: string;
}

export interface UBPRDataRequest {
  rssdId: string;
  reportingPeriod: string;
  dataType: 'quarterly' | 'annual';
}

export interface UBPRBalanceSheet {
  totalAssets: number;
  totalEquityCapital: number;
  totalDeposits: number;
  totalLoansAndLeases: number;
  totalSecurities: number;
  cashAndDueFromDepositoryInstitutions: number;
  federalFundsSoldAndSecuritiesPurchased: number;
  tradingAssets: number;
  premisesAndFixedAssets: number;
  otherRealEstateOwned: number;
  intangibleAssets: number;
  otherAssets: number;
  totalLiabilities: number;
  totalDepositsInsured: number;
  totalDepositsUninsured: number;
  federalFundsPurchasedAndSecuritiesSold: number;
  tradingLiabilities: number;
  otherBorrowedMoney: number;
  subordinatedDebt: number;
  otherLiabilities: number;
}

export interface UBPRIncomeStatement {
  totalInterestIncome: number;
  totalInterestExpense: number;
  netInterestIncome: number;
  totalNoninterestIncome: number;
  totalNoninterestExpense: number;
  provisionForLoanAndLeaseLosses: number;
  incomeTaxes: number;
  netIncome: number;
  netIncomeAttributableToBank: number;
  netIncomeAttributableToNoncontrollingInterest: number;
  totalRevenue: number;
  totalExpense: number;
}

export interface UBPRPerformanceRatios {
  returnOnAssets: number;
  returnOnEquity: number;
  returnOnTangibleEquity: number;
  netInterestMargin: number;
  efficiencyRatio: number;
  overheadEfficiencyRatio: number;
  assetUtilization: number;
  yieldOnEarningAssets: number;
  costOfFundingEarningAssets: number;
  netInterestSpread: number;
  netInterestIncomeToTotalRevenue: number;
  noninterestIncomeToTotalRevenue: number;
  noninterestExpenseToTotalRevenue: number;
  netIncomeToTotalRevenue: number;
}

export interface UBPRCapitalAdequacy {
  tier1CapitalRatio: number;
  totalCapitalRatio: number;
  tier1LeverageRatio: number;
  commonEquityTier1CapitalRatio: number;
  tier1RiskBasedCapital: number;
  totalRiskBasedCapital: number;
  tier1Capital: number;
  totalCapital: number;
  riskWeightedAssets: number;
  averageTotalAssets: number;
  tier1CapitalToAverageTotalAssets: number;
}

export interface UBPRAssetQuality {
  totalNonperformingAssets: number;
  totalNonperformingLoans: number;
  totalPastDueLoans: number;
  totalLoans90DaysOrMorePastDue: number;
  totalLoans3089DaysPastDue: number;
  totalLoansLessThan30DaysPastDue: number;
  totalLoansAndLeases: number;
  allowanceForLoanAndLeaseLosses: number;
  netChargeOffs: number;
  grossChargeOffs: number;
  recoveries: number;
  nonperformingAssetsToTotalAssets: number;
  nonperformingLoansToTotalLoans: number;
  allowanceForLoanAndLeaseLossesToTotalLoans: number;
  netChargeOffsToAverageTotalLoans: number;
}

export interface UBPRLiquidity {
  totalLoansToTotalDeposits: number;
  totalLoansToTotalAssets: number;
  totalDepositsToTotalAssets: number;
  liquidAssetsToTotalDeposits: number;
  liquidAssetsToShortTermLiabilities: number;
  netStableFundingRatio: number;
  liquidityCoverageRatio: number;
  brokeredDepositsToTotalDeposits: number;
  coreDepositsToTotalDeposits: number;
  volatileLiabilitiesToTotalLiabilities: number;
}

export interface UBPRLoanPortfolio {
  commercialAndIndustrialLoans: number;
  realEstateLoans: number;
  residentialRealEstateLoans: number;
  commercialRealEstateLoans: number;
  constructionAndLandDevelopmentLoans: number;
  consumerLoans: number;
  creditCardLoans: number;
  agriculturalLoans: number;
  otherLoans: number;
  totalLoansAndLeases: number;
  commercialAndIndustrialLoansToTotalLoans: number;
  realEstateLoansToTotalLoans: number;
  consumerLoansToTotalLoans: number;
  agriculturalLoansToTotalLoans: number;
}

export interface UBPRDepositStructure {
  demandDeposits: number;
  savingsDeposits: number;
  timeDeposits: number;
  brokeredDeposits: number;
  foreignDeposits: number;
  totalDeposits: number;
  demandDepositsToTotalDeposits: number;
  savingsDepositsToTotalDeposits: number;
  timeDepositsToTotalDeposits: number;
  brokeredDepositsToTotalDeposits: number;
  foreignDepositsToTotalDeposits: number;
}

export interface UBPRSecuritiesPortfolio {
  usTreasurySecurities: number;
  usGovernmentAgencySecurities: number;
  mortgageBackedSecurities: number;
  municipalSecurities: number;
  corporateBonds: number;
  equitySecurities: number;
  otherSecurities: number;
  totalSecurities: number;
  heldToMaturitySecurities: number;
  availableForSaleSecurities: number;
  tradingSecurities: number;
  usTreasurySecuritiesToTotalSecurities: number;
  usGovernmentAgencySecuritiesToTotalSecurities: number;
  mortgageBackedSecuritiesToTotalSecurities: number;
  municipalSecuritiesToTotalSecurities: number;
}

export interface UBPRComprehensiveData {
  rssdId: string;
  reportingPeriod: string;
  filingDate: string;
  balanceSheet: UBPRBalanceSheet;
  incomeStatement: UBPRIncomeStatement;
  performanceRatios: UBPRPerformanceRatios;
  capitalAdequacy: UBPRCapitalAdequacy;
  assetQuality: UBPRAssetQuality;
  liquidity: UBPRLiquidity;
  loanPortfolio: UBPRLoanPortfolio;
  depositStructure: UBPRDepositStructure;
  securitiesPortfolio: UBPRSecuritiesPortfolio;
}

export interface FFIECServiceError {
  code: string;
  message: string;
  details?: string;
}

export interface FFIECServiceResponse<T> {
  success: boolean;
  data?: T;
  error?: FFIECServiceError;
  timestamp: string;
} 