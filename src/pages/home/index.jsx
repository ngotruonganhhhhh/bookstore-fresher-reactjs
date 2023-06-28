import {
    Button,
    Checkbox,
    Col,
    Divider,
    Dropdown,
    Input,
    InputNumber,
    Pagination,
    Row,
    Select,
    Space,
    Typography
} from "antd";
import {useEffect, useState} from "react";
import {getAllBooks, getCategories} from "../../services/useServer.jsx";
import ProductItem from "../../components/productItem/index.jsx";
import PaginationComponent from "../../components/pagination/index.jsx";
import {DownOutlined, UnorderedListOutlined} from "@ant-design/icons";
import {useNavigate} from "react-router-dom";
import "../../styles/global.scss";
const Home = () => {
    const [listBook, setListBook] = useState([]);
    const [listCategories, setListCategories] = useState([]);
    const [current, setCurrent] = useState(1);
    const [total, setTotal] = useState(0);
    const [sort, setSort] = useState('sort=-sold');
    const [filerCategories, setFilterCategories] = useState('');

    const nonAccentVietnamese = (str) => {
        str = str.replace(/A|Á|À|Ã|Ạ|Â|Ấ|Ầ|Ẫ|Ậ|Ă|Ắ|Ằ|Ẵ|Ặ/g, "A");
        str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
        str = str.replace(/E|É|È|Ẽ|Ẹ|Ê|Ế|Ề|Ễ|Ệ/, "E");
        str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
        str = str.replace(/I|Í|Ì|Ĩ|Ị/g, "I");
        str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
        str = str.replace(/O|Ó|Ò|Õ|Ọ|Ô|Ố|Ồ|Ỗ|Ộ|Ơ|Ớ|Ờ|Ỡ|Ợ/g, "O");
        str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
        str = str.replace(/U|Ú|Ù|Ũ|Ụ|Ư|Ứ|Ừ|Ữ|Ự/g, "U");
        str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
        str = str.replace(/Y|Ý|Ỳ|Ỹ|Ỵ/g, "Y");
        str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
        str = str.replace(/Đ/g, "D");
        str = str.replace(/đ/g, "d");
        // Some system encode vietnamese combining accent as individual utf-8 characters
        str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); // Huyền sắc hỏi ngã nặng
        str = str.replace(/\u02C6|\u0306|\u031B/g, ""); // Â, Ê, Ă, Ơ, Ư
        return str;
    }

    const convertSlug = (str) => {
        str = nonAccentVietnamese(str);
        str = str.replace(/^\s+|\s+$/g, ''); // trim
        str = str.toLowerCase();

        // remove accents, swap ñ for n, etc
        const from = "ÁÄÂÀÃÅČÇĆĎÉĚËÈÊẼĔȆĞÍÌÎÏİŇÑÓÖÒÔÕØŘŔŠŞŤÚŮÜÙÛÝŸŽáäâàãåčçćďéěëèêẽĕȇğíìîïıňñóöòôõøðřŕšşťúůüùûýÿžþÞĐđßÆa·/_,:;";
        const to = "AAAAAACCCDEEEEEEEEGIIIIINNOOOOOORRSSTUUUUUYYZaaaaaacccdeeeeeeeegiiiiinnooooooorrsstuuuuuyyzbBDdBAa------";
        for (let i = 0, l = from.length; i < l; i++) {
            str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
        }

        str = str.replace(/[^a-z0-9 -]/g, '') // remove invalid chars
            .replace(/\s+/g, '-') // collapse whitespace and replace by -
            .replace(/-+/g, '-'); // collapse dashes

        return str;
    }

    useEffect(() => {
        getBooks();
        getAllCategories();
    }, [current, sort, filerCategories]);

    const getBooks = async () => {
        const query = `/api/v1/book?current=${current}&pageSize=6&${sort}&category=${filerCategories}`;
        const res = await getAllBooks(query);
        if (res && res.data) {
            setListBook(res.data.data.result);
            setTotal(res.data.data.meta.total);
        }
    }

    const getAllCategories = async () => {
        const res = await getCategories();
        if (res && res.data) {
            const list = res.data.data.map((item) => {
                return {value: item, label: item}
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
    };

    const handleClear = () => {
        setFilterCategories('');
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
    const menu = (e) => {
        setSort(e.key);
        setCurrent(1);
    }

    const navigate = useNavigate();

    const handleViewDetail = (book) => {
        const slug = convertSlug(book.mainText);
        navigate(`/${slug}?id=${book._id}`);
    }
    const handleChange = (value) => {
        console.log(`selected ${value}`);
    };
    return (
        <>
            <Row gutter={[32, 32]}>
                <Col xs={0} xl={4} style={{backgroundColor: 'white', padding: '25px 20px', borderRadius: "3px"}}>
                    <Typography.Paragraph strong={true} style={{display: "flex", alignItems: "center"}}>
                        <UnorderedListOutlined /> &nbsp; All Categories
                    </Typography.Paragraph>
                    <Divider />
                    <Checkbox.Group
                        onChange={onChangeCheckbox}
                    >
                        {listCategories.map((item) => {
                            return (
                                <Col span={24} style={{margin: "5px 0"}}>
                                    <Checkbox value={item.value}>{item.label}</Checkbox>
                                </Col>
                            )
                        })}

                    </Checkbox.Group>
                    <Divider />
                    <Typography.Paragraph strong={true}>
                        Price Range
                    </Typography.Paragraph>
                    <Row justify="space-between">
                        <Col span={10}>
                            <InputNumber placeholder="₫ MIN" min={0} onChange={onChange} />
                        </Col>
                        <Col>
                            _
                        </Col>
                        <Col span={10}>
                            <InputNumber placeholder="₫ MAX" min={0} onChange={onChange} />
                        </Col>
                    </Row>
                    <Button type='primary' danger style={{marginTop:'20px', width: "100%"}} onClick={handleClear}>APPLY</Button>
                    <Divider />
                    <Button type='primary' danger style={{width: "100%"}} onClick={handleClear}>CLEAR ALL</Button>
                </Col>
                <Col xs={24} xl={20}>
                    <Row gutter={[8, 8]} justify="space-between" style={{backgroundColor: 'white', padding: '20px',  borderRadius: "3px"}}>
                        <Col>
                            <Row gutter={[8,8]} style={{display: 'flex', alignItems: 'center'}}>
                                <Col>Sort by</Col>
                                <Col>
                                    {sort === "sort=-sold" ?
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
                                            onClick: menu
                                        }}
                                    >
                                        <Space>
                                            <Typography.Paragraph style={sort === "sort=price" || sort === "sort=-price" ? {color: "red"} : {}}>
                                                Price
                                                <DownOutlined/>
                                            </Typography.Paragraph>
                                        </Space>
                                    </Dropdown>
                                </Col>
                            </Row>
                        </Col>
                        <Col>
                            <Pagination simple current={current} pageSize={6} total={total} onChange={onChange}/>
                        </Col>
                    </Row>
                    <Row gutter={[8, 8]} style={{backgroundColor: 'white', padding: '15px', marginTop: "20px",  borderRadius: "3px"}}>
                        {listBook.map((item) => {
                            return (
                                <Col key={item._id} onClick={() => handleViewDetail(item)} xs={12} md={8} xl={4}>
                                    <ProductItem product={item}/>
                                </Col>
                            )
                        })}
                    </Row>
                    <Row justify="center" style={{marginTop: "20px"}}>
                        <PaginationComponent current={current} pageSize={6} total={total} onChange={onChange}/>
                    </Row>
                </Col>
            </Row>
        </>
    );
};

export default Home;
