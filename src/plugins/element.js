import Vue from 'vue'
// 按需导入所用的元素
import {
    Button,
    Form,
    FormItem,
    Input,
    Message,
    Container,
    Header,
    Aside,
    Main,
    Menu,
    Submenu,
    MenuItemGroup,
    MenuItem,
    Breadcrumb,
    BreadcrumbItem,
    Card,
    Row,
    Col,
    Table,
    TableColumn,
    Pagination,
    Dialog,
    MessageBox,
    Tag,
    Empty,
    InputNumber,
    DatePicker,
    TimePicker,
    Select,
    Option,
    Descriptions,
    DescriptionsItemcriptionsItem,
    DescriptionsItem,
    Upload,
    Link,
    Image,
    Result
} from 'element-ui'



Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Menu)
Vue.use(MenuItemGroup)
Vue.use(Submenu)
Vue.use(MenuItem)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Card)
Vue.use(Row)
Vue.use(Col)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Pagination)
Vue.use(Dialog)
Vue.use(Tag)
Vue.use(Empty)
Vue.use(InputNumber)
Vue.use(DatePicker)
Vue.use(TimePicker)
Vue.use(Select)
Vue.use(Option)
Vue.use(Descriptions)
Vue.use(DescriptionsItem)
Vue.use(Upload)
Vue.use(Link)
Vue.use(Image)
// 把弹窗组件挂载在根app上

Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.confirm