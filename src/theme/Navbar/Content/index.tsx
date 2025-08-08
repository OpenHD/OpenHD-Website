/**
 * OpenHD Navbar Content Wrapper
 * Following Docusaurus 3.8 best practices - wrapping approach
 */
import React, {type ReactNode} from 'react';
import NavbarContent from '@theme-original/Navbar/Content';
import type NavbarContentType from '@theme/Navbar/Content';
import type {WrapperProps} from '@docusaurus/types';

type Props = WrapperProps<typeof NavbarContentType>;

export default function NavbarContentWrapper(props: Props): ReactNode {
  return (
    <>
      <NavbarContent {...props} />
    </>
  );
}