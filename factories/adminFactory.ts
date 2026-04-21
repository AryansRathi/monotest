import { faker } from '@faker-js/faker';
import { getNextUniqueId } from './UniqueId';

export interface TestGroup {
    name: string;
    description: string;
    roles: string[];
    members: string[];
}

export interface TestUser {
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    status: 'ACTIVE' | 'INACTIVE';
    password: string;
    groups: string[];
    roles: string[];
}

export interface TestCredential {
    name: string;
    path: string;
}

export interface TestTokenCredential extends TestCredential {
    token: string;
}

export interface TestApiKeyCredential extends TestCredential {
    apiKey: string;
}

export interface TestUsernamePasswordCredential extends TestCredential {
    username: string;
    password: string;
}

export interface TestClientIdSecretCredential extends TestCredential {
    clientId: string;
    clientSecret: string;
}

export interface TestApiKey {
    name: string;
    id: string;
    roles: string[];
}

export interface TestOAuth2Client {
    /** Suffix after the ixapi- prefix (API `clientId` segment). */
    clientIdSuffix: string;
    /** Display name (API `name` field). */
    name: string;
    description: string;
}

export interface TestRole {
    name: string;
    description: string;
    /** Scope value as used by the Scope enum (e.g. 'TENANT', 'APP_BUILDER'). */
    scope: string;
}

export interface TestCertificate {
    name: string;
    alias: string;
    pemContent: string;
}

// A valid self-signed test certificate for use in E2E tests.
const TEST_PEM_CERTIFICATE = `-----BEGIN CERTIFICATE-----
MIIDZzCCAk+gAwIBAgIUZXacnpfYfZ5bBpHOA727sjl7TEkwDQYJKoZIhvcNAQEL
BQAwQzEdMBsGA1UEAwwUcGxheXdyaWdodC10ZXN0LWNlcnQxFTATBgNVBAoMDElu
dHJleHggVGVzdDELMAkGA1UEBhMCREUwHhcNMjYwMzMxMDk1NjA5WhcNMzYwMzI4
MDk1NjA5WjBDMR0wGwYDVQQDDBRwbGF5d3JpZ2h0LXRlc3QtY2VydDEVMBMGA1UE
CgwMSW50cmV4eCBUZXN0MQswCQYDVQQGEwJERTCCASIwDQYJKoZIhvcNAQEBBQAD
ggEPADCCAQoCggEBAKM1k4CFwu/q2FaLVvSKPxR8f7qWfRLH3es0dldXFrp8sxIv
bRhRnRDExALjic0nVA69EbKty4psTfxnUEFXg8cvWb9vkRicUQ9OQZbqBplUX2I4
+VFuhokyiNYSv/vpPgkMZLQ7X5/MjEPNRuBHlsSHZLYk/RCR4fSCarPIGKk6V8df
rGO4YnoL94+TQsl8orrwQfGc2qxWIcf4tNoiASqVo40Ijq2t287K2nrRdxf1C75v
k9QM2hHEXSD8QDt0BbisxiiH+jXx28OKTrXkCwkAiv+uudac2rk4UNm9L9HpPaWR
YxpGJ0T9bhsemFhaGCzvtQz8VRlww4Rdzx2KcOkCAwEAAaNTMFEwHQYDVR0OBBYE
FLHX+4+y58BVtAQhI42C1qSAOVtMMB8GA1UdIwQYMBaAFLHX+4+y58BVtAQhI42C
1qSAOVtMMA8GA1UdEwEB/wQFMAMBAf8wDQYJKoZIhvcNAQELBQADggEBAGG70WYO
YPKJ86CSmdIYCz8DeTBpLVrCtH9XW6GtQS23uruLRWgoXXBgraD3aYcuQ9L3gqWm
PKYCmI7MZ370I7BU8i7vFkd7kgNmF+yy/ejmDHxjD9NqTHH/Mhe0p/WePhgWeB6S
r5I4R2+HACAYZ2d9VtjTFiPlm6sKfHY26RN7nFW+Ayp0p5tf1KXfLWJFHUFQVWyb
qtEKBhyfVqzkxlp2xv7qnPzoCa4szHqLefA+As7rOryRbCtwC1ZRfBmRk5vsS/Xn
K2pdZhGVD2K3ONu+q3WaR+XuEx/eYQUiOSgegWvYH545v1frvWsi/Ev7LVUo34k3
K/bpVBSyG1l9y7U=
-----END CERTIFICATE-----`;

export class AdminFactory {
    static createCredential(overrides: Partial<TestCredential> = {}): TestCredential {
        const id = getNextUniqueId();
        const name = faker.word.sample();
        return {
            name: `${name} ${id}`,
            path: `${name}/${id}`,
            ...overrides
        };
    }

    static createTokenCredential(
        overrides: Partial<TestTokenCredential> = {}
    ): TestTokenCredential {
        const id = getNextUniqueId();
        const name = faker.word.sample();
        return {
            name: `${name}${id}`,
            path: `${name}/${id}`,
            token: faker.string.alphanumeric(32),
            ...overrides
        };
    }

    static createApiKeyCredential(
        overrides: Partial<TestApiKeyCredential> = {}
    ): TestApiKeyCredential {
        const id = getNextUniqueId();
        const name = faker.word.sample();
        return {
            name: `${name}${id}`,
            path: `${name}/${id}`,
            apiKey: faker.string.alphanumeric(32),
            ...overrides
        };
    }

    static createUsernamePasswordCredential(
        overrides: Partial<TestUsernamePasswordCredential> = {}
    ): TestUsernamePasswordCredential {
        const id = getNextUniqueId();
        const name = faker.word.sample();
        return {
            name: `${name}${id}`,
            path: `${name}/${id}`,
            username: faker.internet.username(),
            password: faker.internet.password({ length: 16 }),
            ...overrides
        };
    }

    static createClientIdSecretCredential(
        overrides: Partial<TestClientIdSecretCredential> = {}
    ): TestClientIdSecretCredential {
        const id = getNextUniqueId();
        const name = faker.word.sample();
        return {
            name: `${name}${id}`,
            path: `${name}/${id}`,
            clientId: faker.string.uuid(),
            clientSecret: faker.string.alphanumeric(48),
            ...overrides
        };
    }

    static createGroup(overrides: Partial<TestGroup> = {}): TestGroup {
        const id = getNextUniqueId();
        const name = faker.company.name();
        const description = faker.lorem.sentence();
        return {
            name: `${name} ${id}`,
            description,
            roles: [],
            members: [],
            ...overrides
        };
    }

    static createUser(overrides: Partial<TestUser> = {}): TestUser {
        const id = getNextUniqueId();
        const firstName = faker.person.firstName();
        const lastName = faker.person.lastName();
        const username = `${firstName.toLowerCase()}-${id}`;
        return {
            username,
            firstName,
            lastName,
            email: faker.internet.email({ firstName: username, lastName }),
            status: 'ACTIVE',
            // Password must satisfy UserModal validation: min 12 chars, uppercase, lowercase, number, symbol
            password: `Test${faker.string.numeric(4)}test!`,
            groups: [],
            roles: [],
            ...overrides
        };
    }

    static createApiKey(overrides: Partial<TestApiKey> = {}): TestApiKey {
        const id = getNextUniqueId();
        const name = faker.word.sample();
        return {
            name: `${name} ${id}`,
            id: `${name}-${id}`,
            roles: [],
            ...overrides
        };
    }

    static createRole(overrides: Partial<TestRole> = {}): TestRole {
        const id = getNextUniqueId();
        const name = faker.word.noun();
        return {
            name: `${name}-${id}`,
            description: faker.lorem.sentence(),
            scope: 'TENANT',
            ...overrides
        };
    }

    static createCertificate(overrides: Partial<TestCertificate> = {}): TestCertificate {
        const id = getNextUniqueId();
        const name = faker.word.sample();
        return {
            name: `${name} ${id}`,
            alias: `${name}-${id}`.toLowerCase().replace(/[^a-z0-9-]/g, '-'),
            pemContent: TEST_PEM_CERTIFICATE,
            ...overrides
        };
    }

    static createOAuth2Client(overrides: Partial<TestOAuth2Client> = {}): TestOAuth2Client {
        const id = getNextUniqueId();
        const base = faker.word.sample();
        const clientIdSuffix = `${base}${id}`;
        return {
            clientIdSuffix,
            name: `${base}-${id}`,
            description: faker.lorem.sentence(),
            ...overrides
        };
    }
}
