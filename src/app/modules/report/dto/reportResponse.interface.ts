export interface IReportResponse {
    id:           string;
    title:        string;
    description:  string;
    solved:       boolean;
    important:    boolean;
    category:     Category;
    status:       string;
    creationDate: Date;
    comments:     null;
    priority:     number;
    userId:       string;
    imageUrls:    string[];
    location:     Location;
    rejectReason: string;
    stateHistory: StateHistory[];
}

export interface Category {
    id:          string;
    name:        string;
    description: string;
}

export interface Location {
    latitude:  number;
    longitude: number;
}

export interface StateHistory {
    status: string;
    date:   Date;
    reason: null | string;
}
