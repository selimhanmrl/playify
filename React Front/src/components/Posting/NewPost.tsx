import React, { useEffect, useState } from "react";
import { Row, Col,  Button, Select, Input } from "antd";
import TextArea from "antd/lib/input/TextArea";
import { PlusCircleOutlined, CheckOutlined, StopOutlined } from '@ant-design/icons'
import { connect } from "react-redux";
import { Community } from "../../types/types/community";
import { toast } from "react-toastify";

const { Option } = Select;

const NewPost = (props: any) => {
	const [isNewCommunityVisible, setIsNewCommunity] = useState(false);
	const [newCommunityName, setNewCommunityName] = useState<string>('');
	const [communitySelectOptions, setCommunitySelectOptions] = useState<string[]>([]);
	const [communityId, setCommunityId] = useState<number>();
	const [title, setTitle] = useState<string>('');
	const [content, setContent] = useState<string>('');
	const [imageUrl, setImageUrl] = useState<string>('');

	const toggleNewCommunity = () => setIsNewCommunity(!isNewCommunityVisible);

	const addCommunity = () => {
		if(props.communities.filter((community: Community) => community.name === newCommunityName).length === 0){
			props.dispatch({type: 'ADD_COMMUNITY', data: {name: newCommunityName}});
			setNewCommunityName('');
			toggleNewCommunity();
		}
		else {
			toast.error('Community Exists')
		}
	}

	const prepareCommunityData = () => {
		setCommunitySelectOptions(props.communities.map((community: Community) => <Option value={community.id}>{community.name}</Option>))
	}


	const createPost = () => {
		if(communityId !== undefined && props.loggedUser?.username !== undefined ){
			props.dispatch({type: 'ADD_POST', data: {title: title, imgUrl: imageUrl, communityId: communityId, content: content}})
		}
		else{
			if(props.loggedUser?.username === undefined)
				toast.error('Please Login')
			else if(!communityId){
				toast.error('Please Select Community')
			}
		}
	}

	useEffect(() => {		
		prepareCommunityData();
		if(!isNewCommunityVisible)
			setNewCommunityName('');
	}, [isNewCommunityVisible])

	return (
		<div>
			<Row gutter = {[0, 24]}>
				<Col>
					<Select
						defaultValue={undefined}
						style={{ width: 180 }}
						onChange={(e: any) => {setCommunityId(e);}}
					>
						{communitySelectOptions}
					</Select>
				</Col>
				<Col>
					<Button icon={<PlusCircleOutlined />}
					onClick = {() => toggleNewCommunity()}></Button>
				</Col>
				<Col>
					{isNewCommunityVisible && <Input placeholder='Community Name' value={newCommunityName} onChange={(e: any) => setNewCommunityName(e.target.value)} addonAfter={<Row><CheckOutlined onClick={() => addCommunity()}/><StopOutlined onClick={() => {setNewCommunityName(''); toggleNewCommunity()}}/></Row>}/>}
				</Col>
			</Row>
			<Row gutter = {[0, 16]}>
				<Input placeholder = 'Image Url' value={imageUrl} onChange={(e: any) => setImageUrl(e.target.value)}/>
			</Row>
			<Row gutter = {[0, 16]}>
				<Input placeholder = "Title" value={title} onChange={(e: any) => setTitle(e.target.value)}></Input>
			</Row>
			<Row gutter = {[0, 8]}>
				<TextArea placeholder = "Type something..." value={content} onChange={(e: any) => setContent(e.target.value)}></TextArea>
			</Row>
		</div>
	);
};

const mapStateToProps = (state: any) => ({
	communities: state.communities,
	loggedUser: state.loggedUser
});

export default connect(mapStateToProps)(NewPost);
