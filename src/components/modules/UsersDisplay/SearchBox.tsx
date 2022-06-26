// LIB-FUNCTIONS
import { useEffect } from 'react';
// LIB-COMPONENTS
import { Grid, TextField } from '@mui/material';
// COMPONENTS
import Select from 'src/components/modules/Select';
// RECOIL
import { useRecoilState, useRecoilValue } from 'recoil';
import { usersDisplayAtoms, useFilterUsers } from '.';

// MAIN-COMPONENT
export default function SearchBox() {
    // RECOIL
    const variant = useRecoilValue(usersDisplayAtoms.variant);
    const [search, setSearch] = useRecoilState(usersDisplayAtoms.search);
    const [filter, setFilter] = useRecoilState(usersDisplayAtoms.filter);
    const [orderBy, setOrderBy] = useRecoilState(usersDisplayAtoms.orderBy);
    const [orderDirection, setOrderDirection] = useRecoilState(
        usersDisplayAtoms.orderDirection
    );
    const filterUsers = useFilterUsers();
    useEffect(() => {
        filterUsers();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search, filter, orderBy, orderDirection]);
    // RENDER
    return (
        <Container>
            <Grid container spacing={2}>
                <Grid item xs={12} lg={6}>
                    <TextField
                        variant="outlined"
                        label="Search"
                        placeholder="Search something..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        fullWidth
                    />
                </Grid>
                <Grid item xs={4} lg={2}>
                    <Select
                        label="Filter"
                        value={filter}
                        setValue={(value) => setFilter(value)}
                        items={[
                            ...(variant === 'teachers'
                                ? [
                                      { label: 'All', value: 'all' },
                                      {
                                          label: 'Verified',
                                          value: 'teacher-verified',
                                      },
                                      {
                                          label: 'Not Verified',
                                          value: 'teacher-not-verified',
                                      },
                                  ]
                                : [
                                      { label: 'All', value: 'all' },
                                      { label: 'Enrolled', value: 'enrolled' },
                                      {
                                          label: 'Not Enrolled',
                                          value: 'not-enrolled',
                                      },
                                  ]),
                            {
                                label: 'Email Verified',
                                value: 'email-verified',
                            },
                            {
                                label: 'Email Not Verified',
                                value: 'email-not-verified',
                            },
                            {
                                label: 'Banned',
                                value: 'banned',
                            },
                            {
                                label: 'Not Banned',
                                value: 'not-banned',
                            },
                        ]}
                    />
                </Grid>
                <Grid item xs={4} lg={2}>
                    <Select
                        label="Order By"
                        value={orderBy}
                        setValue={(value) => setOrderBy(value)}
                        items={[
                            { label: 'Name', value: 'name' },
                            { label: 'Created At', value: 'createdAt' },
                        ]}
                    />
                </Grid>
                <Grid item xs={4} lg={2}>
                    <Select
                        label="Order Direction"
                        value={orderDirection}
                        setValue={(value) => setOrderDirection(value)}
                        items={[
                            { label: 'Ascending', value: 'asc' },
                            { label: 'Descending', value: 'desc' },
                        ]}
                    />
                </Grid>
            </Grid>
        </Container>
    );
}

// STYLES
import { styled } from '@mui/material';
import styles from 'src/utils/styles';
const Container = styled('div')({
    ...styles.border(1),
    ...styles.borderRadius(1),
    ...styles.p(2),
    width: '100%',
    backgroundColor: 'white',
});
