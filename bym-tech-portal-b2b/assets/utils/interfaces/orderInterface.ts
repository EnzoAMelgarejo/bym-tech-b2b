export default interface orderInterface {
    id: number
    number: String
    type: String
    status: String
    bio: String
    dueDate:Date
    deliveryDate: Date
    total: number
    companyId: number
    userId: number
    addressId: number
    refNumber: String
    document: String
    clientCode:String
}