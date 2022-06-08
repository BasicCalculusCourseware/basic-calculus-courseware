// LIB-TYPES
import type { Dispatch, SetStateAction } from 'react';
// TYPES
import type { User, ChildrenProp } from 'src/interfaces';
// LIB-FUNCTIONS
import { createContext, useContext, useState } from 'react';
// FUNCTIONS
import initialStates from 'src/utils/initialStates';
// COMPONENTS
import AccountDisplay from './AccountDisplay';

// MAIN-COMPONENT
export default AccountDisplay;

/* STATES START */

// CONTEXT
interface AccountDisplayStates {
    tab: number;
    setTab: Dispatch<SetStateAction<number>>;
    user: User;
    refreshUser: () => Promise<void>;
}
const AccountDisplayContext = createContext<AccountDisplayStates>({
    tab: 1,
    setTab: () => {},
    user: initialStates.user,
    refreshUser: async () => {},
});
export const useAccountDisplayContext = () => useContext(AccountDisplayContext);

// SETTER
interface Props extends ChildrenProp {
    user: User;
    refreshUser: () => Promise<void>;
}
export function AccountDisplaySetter({ children, user, refreshUser }: Props) {
    // STATES
    const [tab, setTab] = useState(1);
    // RENDER
    return (
        <AccountDisplayContext.Provider value={{ tab, setTab, user, refreshUser }}>
            {children}
        </AccountDisplayContext.Provider>
    );
}

/* STATES END */
