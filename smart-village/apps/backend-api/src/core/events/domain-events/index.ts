// ============================================================
// Domain Events - Event definitions for the entire platform
// ============================================================

export class CitizenCreatedEvent {
  constructor(
    public readonly citizenId: string,
    public readonly villageId: string,
    public readonly nik: string,
    public readonly name: string,
    public readonly gender: string,
    public readonly timestamp: Date = new Date(),
  ) {}

  get name(): string {
    return 'CitizenCreated';
  }

  get data(): any {
    return {
      citizenId: this.citizenId,
      villageId: this.villageId,
      nik: this.nik,
      name: this.name,
      gender: this.gender,
    };
  }
}

export class CitizenUpdatedEvent {
  constructor(
    public readonly citizenId: string,
    public readonly villageId: string,
    public readonly changes: Record<string, any>,
    public readonly timestamp: Date = new Date(),
  ) {}

  get name(): string {
    return 'CitizenUpdated';
  }

  get data(): any {
    return {
      citizenId: this.citizenId,
      villageId: this.villageId,
      changes: this.changes,
    };
  }
}

export class CitizenDeletedEvent {
  constructor(
    public readonly citizenId: string,
    public readonly villageId: string,
    public readonly timestamp: Date = new Date(),
  ) {}

  get name(): string {
    return 'CitizenDeleted';
  }

  get data(): any {
    return {
      citizenId: this.citizenId,
      villageId: this.villageId,
    };
  }
}

export class LetterSubmittedEvent {
  constructor(
    public readonly letterId: string,
    public readonly villageId: string,
    public readonly citizenId: string,
    public readonly letterType: string,
    public readonly submittedBy: string,
    public readonly timestamp: Date = new Date(),
  ) {}

  get name(): string {
    return 'LetterSubmitted';
  }

  get data(): any {
    return {
      letterId: this.letterId,
      villageId: this.villageId,
      citizenId: this.citizenId,
      letterType: this.letterType,
      submittedBy: this.submittedBy,
    };
  }
}

export class LetterApprovedEvent {
  constructor(
    public readonly letterId: string,
    public readonly villageId: string,
    public readonly approvedBy: string,
    public readonly timestamp: Date = new Date(),
  ) {}

  get name(): string {
    return 'LetterApproved';
  }

  get data(): any {
    return {
      letterId: this.letterId,
      villageId: this.villageId,
      approvedBy: this.approvedBy,
    };
  }
}

export class ComplaintFiledEvent {
  constructor(
    public readonly complaintId: string,
    public readonly villageId: string,
    public readonly category: string,
    public readonly submittedBy: string,
    public readonly timestamp: Date = new Date(),
  ) {}

  get name(): string {
    return 'ComplaintFiled';
  }

  get data(): any {
    return {
      complaintId: this.complaintId,
      villageId: this.villageId,
      category: this.category,
      submittedBy: this.submittedBy,
    };
  }
}

export class ComplaintResolvedEvent {
  constructor(
    public readonly complaintId: string,
    public readonly villageId: string,
    public readonly resolvedBy: string,
    public readonly resolution: string,
    public readonly timestamp: Date = new Date(),
  ) {}

  get name(): string {
    return 'ComplaintResolved';
  }

  get data(): any {
    return {
      complaintId: this.complaintId,
      villageId: this.villageId,
      resolvedBy: this.resolvedBy,
      resolution: this.resolution,
    };
  }
}

export class UserLoggedInEvent {
  constructor(
    public readonly userId: string,
    public readonly villageId: string | null,
    public readonly ipAddress: string | null,
    public readonly timestamp: Date = new Date(),
  ) {}

  get name(): string {
    return 'UserLoggedIn';
  }

  get data(): any {
    return {
      userId: this.userId,
      villageId: this.villageId,
      ipAddress: this.ipAddress,
    };
  }
}

export class AssetCreatedEvent {
  constructor(
    public readonly assetId: string,
    public readonly villageId: string,
    public readonly category: string,
    public readonly timestamp: Date = new Date(),
  ) {}

  get name(): string {
    return 'AssetCreated';
  }

  get data(): any {
    return {
      assetId: this.assetId,
      villageId: this.villageId,
      category: this.category,
    };
  }
}

export class ProjectProgressUpdatedEvent {
  constructor(
    public readonly projectId: string,
    public readonly villageId: string,
    public readonly percentage: number,
    public readonly timestamp: Date = new Date(),
  ) {}

  get name(): string {
    return 'ProjectProgressUpdated';
  }

  get data(): any {
    return {
      projectId: this.projectId,
      villageId: this.villageId,
      percentage: this.percentage,
    };
  }
}

export class PanicButtonPressedEvent {
  constructor(
    public readonly panicId: string,
    public readonly villageId: string,
    public readonly latitude: number | null,
    public readonly longitude: number | null,
    public readonly type: string,
    public readonly timestamp: Date = new Date(),
  ) {}

  get name(): string {
    return 'PanicButtonPressed';
  }

  get data(): any {
    return {
      panicId: this.panicId,
      villageId: this.villageId,
      latitude: this.latitude,
      longitude: this.longitude,
      type: this.type,
    };
  }
}