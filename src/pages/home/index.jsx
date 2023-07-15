import {Button, Checkbox, Col, Divider, Drawer, Dropdown, Pagination, Row, Skeleton, Typography} from "antd";
import {DownOutlined, FilterOutlined, UnorderedListOutlined} from "@ant-design/icons";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import ProductItem from "../../components/productItem/index.jsx";
import {convertSlug} from "../../function/index.jsx";
import {getAllBooks, getCategories} from "../../services/book.jsx";
import {useSelector} from "react-redux";
import Loading from "../../components/loading/index.jsx";

const Home = () => {
    const navigate = useNavigate();
    const [listBook, setListBook] = useState([]);
    const [open, setOpen] = useState(false);

    // categories
    const [listCategories, setListCategories] = useState([]);
    const [filerCategories, setFilterCategories] = useState([]);
    // pagination
    const [current, setCurrent] = useState(1);
    const pageSize = 4;
    const [total, setTotal] = useState(0);
    // sort
    const [sort, setSort] = useState('sort=-sold');
    const mainText = useSelector(state => state.search.searchText);


    useEffect(() => {
        getBooks();
        getAllCategories();
    }, [current, sort, filerCategories, mainText]);

    const getBooks = async () => {
        const query = `/api/v1/book?current=${current}&pageSize=${pageSize}&${sort}&category=${filerCategories}&mainText=/${mainText}/i`;
        const res = await getAllBooks(query);
        if (res && res.data) {
            setListBook(res.data.data.result);
            setTotal(res.data.data.meta.total);
        }
    }

    const getAllCategories = async () => {
        const res = await getCategories();
        if (res && res.data) {
            const list = res.data.data.map(item => {
                return {id: item, label: item}
            })
            setListCategories(list);
        }
    }

    const onChange = (page) => {
        setCurrent(page);
    };

    const onChangeCheckbox = (checkedValues) => {
        const convert = checkedValues.join();
        setFilterCategories(convert);
        setCurrent(1);
    };

    const handleClearAll = () => {
        setFilterCategories([]);
    }

    const ChangeSort = () => {
        setSort("sort=-sold");
        setCurrent(1);
    }

    const ChangeSortLatest = () => {
        setSort("sort=sold");
        setCurrent(1);
    }

    const items = [
        {
            key: 'sort=price',
            label: (
                <span style={sort === 'sort=price' ? {color: "red"} : {}}>
                    Price: Low to High
                </span>
            ),
        },
        {
            key: 'sort=-price',
            label: (
                <span style={sort === 'sort=-price' ? {color: "red"} : {}}>
                    Price: High to Low
                </span>
            ),
        }
    ]

    const ChangeSortDropdown = (e) => {
        setSort(e.key);
        setCurrent(1);
    }

    const handleViewDetailInOrder = (book) => {
        const slug = convertSlug(book.mainText);
        navigate(`/${slug}?id=${book._id}`);
    }

    const showDrawer = () => {
        setOpen(true);
    };

    const onClose = () => {
        setOpen(false);
    };
    return (
        <>
            {listBook && listBook.length > 0 ? (
                <Row gutter={[16, 16]}>
                    <Col
                        xs={24} md={5}
                        style={{backgroundColor: 'white', borderRadius: "3px", paddingTop: "10px"}}
                        className='filter-d'
                    >
                        <Drawer
                            title="Filter"
                            placement='left'
                            closable={true}
                            onClose={onClose}
                            open={open}
                            width='100%'
                        >
                            <Typography.Paragraph strong={true} style={{display: "flex", alignItems: "center"}}>
                                <UnorderedListOutlined/> &nbsp; All Categories
                            </Typography.Paragraph>
                            <Divider/>
                            <Checkbox.Group
                                onChange={onChangeCheckbox}
                            >
                                {listCategories.map(item => {
                                    return (
                                        <Col key={item.id}
                                             span={24}
                                             style={{margin: "5px 0"}}
                                        >
                                            <Checkbox value={item.label}>
                                                {item.label}
                                            </Checkbox>
                                        </Col>
                                    )
                                })}
                            </Checkbox.Group>
                            {/*<Divider />*/}
                            {/*<Typography.Paragraph strong={true}>*/}
                            {/*    Price Range*/}
                            {/*</Typography.Paragraph>*/}
                            {/*<Row justify="space-between">*/}
                            {/*    <Col span={10}>*/}
                            {/*        <InputNumber placeholder="₫ MIN" min={0} onChange={onChange} />*/}
                            {/*    </Col>*/}
                            {/*    <Col>*/}
                            {/*        _*/}
                            {/*    </Col>*/}
                            {/*    <Col span={10}>*/}
                            {/*        <InputNumber placeholder="₫ MAX" min={0} onChange={onChange} />*/}
                            {/*    </Col>*/}
                            {/*</Row>*/}

                            {/*<Button type='primary' danger style={{marginTop:'20px', width: "100%"}}>APPLY</Button>*/}
                            <Divider/>
                            <Button type='primary' danger style={{width: "100%"}} onClick={handleClearAll}>
                                CLEAR ALL
                            </Button>
                        </Drawer>
                        <Typography.Paragraph strong={true} style={{display: "flex", alignItems: "center"}}>
                            <UnorderedListOutlined/> &nbsp; All Categories
                        </Typography.Paragraph>
                        <Divider/>
                        <Checkbox.Group
                            onChange={onChangeCheckbox}
                        >
                            {listCategories.map(item => {
                                return (
                                    <Col
                                        key={item.id}
                                        span={24}
                                        style={{margin: "5px 0"}}
                                    >
                                        <Checkbox value={item.label}>
                                            {item.label}
                                        </Checkbox>
                                    </Col>
                                )
                            })}
                        </Checkbox.Group>
                        {/*<Divider />*/}
                        {/*<Typography.Paragraph strong={true}>*/}
                        {/*    Price Range*/}
                        {/*</Typography.Paragraph>*/}
                        {/*<Row justify="space-between">*/}
                        {/*    <Col span={10}>*/}
                        {/*        <InputNumber placeholder="₫ MIN" min={0} onChange={onChange} />*/}
                        {/*    </Col>*/}
                        {/*    <Col>*/}
                        {/*        _*/}
                        {/*    </Col>*/}
                        {/*    <Col span={10}>*/}
                        {/*        <InputNumber placeholder="₫ MAX" min={0} onChange={onChange} />*/}
                        {/*    </Col>*/}
                        {/*</Row>*/}

                        {/*<Button type='primary' danger style={{marginTop:'20px', width: "100%"}}>APPLY</Button>*/}
                        <Divider/>
                        <Button type='primary' danger style={{width: "100%"}} onClick={handleClearAll}>
                            CLEAR ALL
                        </Button>
                    </Col>
                    {/*sort*/}
                    <Col xs={24} md={19}>
                        <Row
                            justify="space-between"
                            align='middle'
                            style={{backgroundColor: 'white', padding: '20px', borderRadius: "3px"}}
                        >
                            <Col>
                                <Row gutter={[8, 8]} style={{display: 'flex', alignItems: 'center'}}>
                                    <Col>
                                        <FilterOutlined onClick={showDrawer} className='menuIcon'/>
                                    </Col>
                                    <Col>Sort by</Col>

                                    <Col>
                                        {sort === 'sort=-sold' ?
                                            <Button type="primary" danger onClick={ChangeSort}>Popular</Button> :
                                            <Button danger onClick={ChangeSort}>Popular</Button>
                                        }
                                    </Col>
                                    <Col>
                                        {sort === "sort=sold" ?
                                            <Button type="primary" danger onClick={ChangeSortLatest}>Latest</Button> :
                                            <Button danger onClick={ChangeSortLatest}>Latest</Button>
                                        }
                                    </Col>
                                    <Col>
                                        <Dropdown
                                            menu={{
                                                items,
                                                onClick: ChangeSortDropdown
                                            }}
                                        >
                                            {sort === 'sort=-price' || sort === 'sort=price' ? (
                                                <Button
                                                    type='primary'
                                                    danger
                                                    style={{
                                                        width: '200px',
                                                        display: 'flex',
                                                        justifyContent: 'space-between',
                                                        alignItems: 'center',
                                                    }}
                                                >
                                            <span>
                                                Price: {sort === 'sort=price' ? 'Low to High' : 'High to Low'}
                                            </span>
                                                    <DownOutlined/>
                                                </Button>
                                            ) : (
                                                <Button
                                                    danger
                                                    style={{
                                                        width: '200px',
                                                        display: 'flex',
                                                        justifyContent: 'space-between',
                                                        alignItems: 'center'
                                                    }}
                                                >
                                                    Price
                                                    <DownOutlined/>
                                                </Button>
                                            )
                                            }
                                        </Dropdown>
                                    </Col>
                                </Row>
                            </Col>
                            <Col>
                                <Pagination
                                    simple
                                    current={current}
                                    pageSize={pageSize}
                                    total={total}
                                    onChange={onChange}
                                />
                            </Col>
                        </Row>
                        {/*book home*/}
                        <Row gutter={[8, 8]} style={{marginTop: "20px", borderRadius: "3px"}}>
                            {listBook && listBook.length > 0 && listBook.map(item => {
                                return (
                                    <Col key={item._id}
                                         onClick={() => handleViewDetailInOrder(item)}
                                         xs={24} sm={12} lg={8} xl={6} xxl={4}
                                         style={{padding: '10px'}}>
                                        <ProductItem product={item} />
                                    </Col>
                                )
                            })}
                        </Row>
                        {/*paginate*/}
                        <Row justify="center" style={{margin: "20px 0"}}>
                            <Col>
                                <Pagination
                                    current={current}
                                    pageSize={pageSize}
                                    total={total}
                                    onChange={onChange}
                                />
                            </Col>
                        </Row>
                    </Col>
                </Row>
            ) : (
                <Loading />
            )}
        </>
    );
};

export default Home;
