// frontend/src/components/Modal.js

    import React, { Component } from "react";
    import {
      Button,
      Modal,
      ModalHeader,
      ModalBody,
      ModalFooter,
      Form,
      FormGroup,
      Input,
      Label
    } from "reactstrap";

    import {quality_selectOptions, specification_selectOptions, receipt_selectOptions} from "../constants";

    export default class CustomModal extends Component {
      constructor(props) {
        super(props);
        this.state = {
          activeItem: this.props.activeItem
        };
      }
      handleChange = e => {
        let { name, value } = e.target;
        console.log("name is "+name+", value is "+value);
        if (e.target.type === "checkbox") {
          value = e.target.checked;
        }
        const activeItem = { ...this.state.activeItem, [name]: value };
        this.setState({ activeItem });
      };
      render() {
        const { toggle, onSave } = this.props;
        return (
          <Modal isOpen={true} toggle={toggle}>
            <ModalHeader toggle={toggle}> 新的交易 </ModalHeader>
            <ModalBody>
              <Form>
                <FormGroup>
                  <Label for="item_id">产品ID</Label>
                  <Input
                    type="text"
                    name="item_id"
                    value={this.state.activeItem.item_id}
                    onChange={this.handleChange}
                    placeholder="输入产品ID"
                  />
                </FormGroup>
                <FormGroup>
                  <Label for="name">商品名称</Label>
                  <Input
                    type="text"
                    name="name"
                    value={this.state.activeItem.name}
                    onChange={this.handleChange}
                    placeholder="输入商品名称"
                  />
                </FormGroup>
                <FormGroup>
                  <Label for="brand">品牌</Label>
                  <Input
                    type="text"
                    name="brand"
                    value={this.state.activeItem.brand}
                    onChange={this.handleChange}
                    placeholder="输入品牌"
                  />
                </FormGroup>
                <FormGroup>
                  <Label for="unit_price">单价</Label>
                  <Input
                    type="number"
                    name="unit_price"
                    value={this.state.activeItem.unit_price}
                    onChange={this.handleChange}
                    placeholder="输入产品单价"
                  />
                </FormGroup>
                <FormGroup>
                  <Label for="total_price">总价</Label>
                  <Input
                    type="number"
                    name="total_price"
                    value={this.state.activeItem.total_price}
                    onChange={this.handleChange}
                    placeholder="输入产品总价"
                  />
                </FormGroup>
                <FormGroup>
                  <Label for="specification">产品规格</Label>
                  <Input
                    type="select"
                    name="specification"
                    value={this.state.activeItem.specification}
                    onChange={this.handleChange}
                    placeholder="输入商品规格"
                  >
                    <option>{specification_selectOptions[0]}</option>
                    <option>{specification_selectOptions[1]}</option>
                    <option>{specification_selectOptions[2]}</option>
                  </Input>
                </FormGroup>
                <FormGroup>
                  <Label for="quality">产品质量</Label>
                  <Input
                    type="select"
                    name="quality"
                    value={this.state.activeItem.quality}
                    onChange={this.handleChange}
                    placeholder="选择产品质量">
                      <option>{quality_selectOptions[0]}</option>
                      <option>{quality_selectOptions[1]}</option>
                      <option>{quality_selectOptions[2]}</option>
                      <option>{quality_selectOptions[3]}</option>
                      <option>{quality_selectOptions[4]}</option>
                  </Input>
                  </FormGroup>
                  <FormGroup>
                  <Label for="vendor">供货商</Label>
                  <Input
                    type="text"
                    name="vendor"
                    value={this.state.activeItem.vendor}
                    onChange={this.handleChange}
                    placeholder="输入供货商"
                  />
                  </FormGroup>
                  <FormGroup>
                  <Label for="agent">经手人</Label>
                  <Input
                    type="text"
                    name="agent"
                    value={this.state.activeItem.agent}
                    onChange={this.handleChange}
                    placeholder="输入经手人"
                  />
                  </FormGroup>
                  <FormGroup check>
                  <Label for="receipt_bool">有无发票</Label>
                  <Input
                    type="checkbox"
                    name="receipt_bool"
                    value={this.state.activeItem.receipt_bool}
                    onChange={this.handleChange}
                  />
                  </FormGroup>
                  <FormGroup>
                  <Label for="created_date">创建日期</Label>
                  <Input
                    type="date"
                    name="created_date"
                    value={this.state.activeItem.created_date}
                    onChange={this.handleChange}
                  />
                  </FormGroup>
              </Form>
            </ModalBody>
            <ModalFooter>
              <Button color="success" onClick={() => onSave(this.state.activeItem)}>
                Save
              </Button>
            </ModalFooter>
          </Modal>
        );
      }
    }