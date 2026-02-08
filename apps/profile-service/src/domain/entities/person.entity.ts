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
    private constructor(private props: CreatePersonProps & { id: string }) { }

    static create(props: CreatePersonProps): Person {
        return new Person({
            ...props,
            id: crypto.randomUUID(),
        });
    }

    static restore(props: CreatePersonProps & { id: string }): Person {
        return new Person(props);
    }

    complete(data: {
        fullName: string;
        dateOfBirth?: Date;
        countryId: string;
        nationality?: string;
        documentType: DocumentType;
        documentNumber: string;
    }) {
        this.props.fullName = data.fullName;
        this.props.dateOfBirth = data.dateOfBirth;
        this.props.countryId = data.countryId;
        this.props.nationality = data.nationality;
        this.props.documentType = data.documentType;
        this.props.documentNumber = data.documentNumber;
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
