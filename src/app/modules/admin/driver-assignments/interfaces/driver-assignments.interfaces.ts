export interface RouteLocation {
    latitude: number;
    longitude: number;
}

export interface DriverAssignmentRequest {
    driver_id: number;
    vehicle_id: number;
    travel_date: string;
    route_name: string;
    origin_location: RouteLocation;
    destination_location: RouteLocation;
    completed_successfully?: boolean;
    problem_description?: string | null;
    comments?: string | null;
}

export interface DriverAssignmentUpdate{
    route_name: string;
    origin_location: RouteLocation;
    destination_location: RouteLocation;
    completed_successfully: boolean;
    problem_description: string | null;
    comments: string | null;
}

export interface DriverAssignment {
    driver_id: number;
    vehicle_id: number;
    travel_date: string;
    route_name: string;
    origin_location: RouteLocation;
    destination_location: RouteLocation;
    completed_successfully: boolean;
    problem_description: string | null;
    comments: string | null;
    creation_date: string;
    active: boolean;
}
