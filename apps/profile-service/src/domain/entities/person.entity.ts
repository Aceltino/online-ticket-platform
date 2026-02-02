    import { DocumentType } from '../enums/document-type.enum';

    interface CreatePersonProps {
    userId: string;
    fullName: string;
    countryId: string;
    documentType: DocumentType;
    documentNumber: string;
    nationality?: string;
    dateOfBirth?: Date;
    }

    export class Person {
    private constructor(private props: CreatePersonProps & { id: string }) {}

    static create(props: CreatePersonProps): Person {
        return new Person({
        ...props,
        id: crypto.randomUUID(),
        });
    }

    static restore(props: CreatePersonProps & { id: string }): Person {
        return new Person(props);
    }

    get id() {
        return this.props.id;
    }

    get userId() {
        return this.props.userId;
    }

    get fullName() {
        return this.props.fullName;
    }

    get countryId() {
        return this.props.countryId;
    }

    get documentType() {
        return this.props.documentType;
    }

    get documentNumber() {
        return this.props.documentNumber;
    }

    get nationality() {
        return this.props.nationality;
    }

    get dateOfBirth() {
        return this.props.dateOfBirth;
    }


    }
