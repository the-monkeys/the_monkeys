import styled from "styled-components";
import { Menu } from "@headlessui/react";
import { ReactComponent as ProfileSvg } from "../../images/profile.svg";

export const StyledMenuButton = styled(Menu.Button)`
  border-radius: 5px;
  display: flex;
  font-size: 14px;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

export const StyledMenuItems = styled(Menu.Items)`
  width: 200px;
`;

export const StyledMenuItem = styled(Menu.Item)`
  text-transform: capitalize;
`;

export const StyledSvg = styled(ProfileSvg)`
  width: 15px;
  height: 15px;
  color: #161616;
`;

export const StyledSpan = styled("span")`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0px 5px;
  font-size: 14px;
  color: #161616;
`;
