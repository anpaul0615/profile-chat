import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

/* Style-Wrapper */
const MoreButtonWrapper = styled.div`
  width: 100%;
  height: 20px;
`;
const TextButton = styled.span`
  color: rgb(169,169,169);
  cursor: pointer;
`;
/* Component */
const MoreButton = (props) => {
  const { handleGetOlderMessages } = props;
  return (
    <MoreButtonWrapper>
      <TextButton onClick={() => handleGetOlderMessages()}>
        more
      </TextButton>
    </MoreButtonWrapper>
  );
};

MoreButton.propTypes = {
  handleGetOlderMessages: PropTypes.func.isRequired,
};

export default MoreButton;
