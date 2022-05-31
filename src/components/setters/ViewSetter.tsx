// TYPES
import { ChildrenProp, Result } from 'src/interfaces';
// LIB FUNCTIONS
import { useEffect } from 'react';
// COMPONENTS
import PageSetter from './PageSetter';
// RECOIL
import { useSetRecoilState } from 'recoil';
import { gsspAtoms } from 'src/states/gssp';
import { pageAtoms } from 'src/states/page';

interface Props extends ChildrenProp {
    gssp?: Result;
    pageBase: string;
    isPageUsingSidebar: boolean;
}

export default function ViewSetter(props: Props) {
    // RECOIL
    const setGSSP = useSetRecoilState(gsspAtoms.gssp);
    const setPageBase = useSetRecoilState(pageAtoms.pageBase);
    const setIsPageUsingSidebar = useSetRecoilState(pageAtoms.isPageUsingSidebar);
    useEffect(() => {
        if (props.gssp) setGSSP(props.gssp);
        setPageBase(props.pageBase);
        setIsPageUsingSidebar(props.isPageUsingSidebar);
    }, [props, setGSSP, setPageBase, setIsPageUsingSidebar]);
    // RENDER
    return <PageSetter>{props.children}</PageSetter>;
}
