export interface Vehicle {
    id: number;
    brand: string;
    model: string;
    vin: string;
    plate: string;
    purchase_date: string;
    cost: number;
    picture: string;
    entry_date: string;
}

export interface AssignmentVehicle {
    brand: string;
    model: string;
    vin: string;
    plate: string;
}