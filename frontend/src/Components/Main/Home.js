import React, { Component } from 'react';
import { render } from 'react-dom';

const Home = props => {
	
	const renderedPosts = [];
	props.plantposts.forEach(post => {
		renderedPosts.push(<div>{post.title}</div>)
	});
	return <div>{renderedPosts}</div>
}

export default Home;