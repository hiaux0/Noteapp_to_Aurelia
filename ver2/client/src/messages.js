export class EntryDeleted {
  constructor(deletedId) {
    this.deletedId = deletedId
  }
}

export class EntryUpdated {
  constructor(updatedEntry,updatedKeys) {
    this.updatedEntry = updatedEntry
    this.updatedKeys = updatedKeys
  }
}
