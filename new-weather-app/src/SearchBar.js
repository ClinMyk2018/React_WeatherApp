import React from "react";

const SearchBar = props => {

    return (
      <div className="m-3">
        <form onSubmit= {props.onFormSubmit}>
            <input type="text" placeholder="Search Something" onChange={props.updateSearchTerm} value={props.term}/>
        </form>
      </div>
    );
  }

export default SearchBar;
