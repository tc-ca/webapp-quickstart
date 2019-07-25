import { Component } from 'vue';

export interface Dictionary < T > {
    [index: string]: T;
}

export interface Route {
    name?: string;
    path: string;
    component?: Component;
    label?: string;
    icon?: string;
	redirect?: any;
	beforeEnter?:()=>void;
}

export interface DDLEntry {
    text: string;
    value: string;
}

export interface RC {
	baseCode: string;
    baseName: string;
    branchCode: string;
    branchName: string;
    directorateCode: string;
    directorateName: string;
    groupCode: string;
    groupName: string;
}

export interface Employee extends RC {
    assignmentCode: string;
    assignmentName: string;
    employeeGroupCode: string;
    employeeLevelCode: string;
    pri: string;
    firstName: string;
    lastName: string;
    rate: number;
    regionCode: string;
    regionName: string;
    statusCode: string;
    statusName: string;
    totalFTE: number;
    projectCount: number;
}

export interface Project {
    coreActivityCategoryTag: string;
    corporateRiskStatement: string;
    description: string;
    fundingSource: string;
    name: string;
    pipIndicators: string;
    pipOutcomeResult: string;
    programInventoryCode: string;
    code: string;
    riskResponseStrategy: string;
    voteCode: string;
    voteName: string;
    employeeCount: number;
    totalFTE: number;
    totalSalary: number;
    totalOOC: number;
    totalCost: number;
}

export interface FTE {
    pri: string;
    fte: number;
    projectCode: string;
}

export interface OOC {
    projectCode: string;
    roCode: string;
    roName: string;
    ooc: number;
}

export interface ProjectRC extends RC {
    projectCode: string;
}