import React, { useEffect, useLayoutEffect , useRef, useState } from "react";
import MenuBtn from "./MenuBtn";

const Menu = ({ cords, showMenu, setShowMenu, threeDotsRef }) => {
  const menuRef = useRef(null);

  useLayoutEffect(() => {
    // close menu on click on window, except menu itself -->
    function handleWindowClick(e) {
      // don't close menu while click on three dots or menu itself -->
      if (
        menuRef.current?.contains(e.target) ||
        threeDotsRef.current?.contains(e.target)
      )
        return;

      setShowMenu(false);
    }

    // also close menu on resize -->
    function handleResize() {
      setShowMenu(false);
    }

    // add event handler to close menu on click on window -->
    // Close on ANY click, left or right
    window.addEventListener("mousedown", handleWindowClick);
    window.addEventListener("contextmenu", handleWindowClick);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("mousedown", handleWindowClick);
      window.removeEventListener("contextmenu", handleWindowClick);
      window.removeEventListener("resize", handleResize);
    };
  }, [showMenu, threeDotsRef]);

  // Don't render until cords are ready
  if (!cords?.top || !cords?.left) return null;

  // JSX -->
  return (
    <div
      ref={menuRef}
      style={{
        position: "fixed",
        top: cords.top,
        left: cords.left,
      }}
      id="popup-menu"
      className={`shadow-element size-auto my-[2.7rem] flex flex-col p-2 border-1 rounded-2xl border-gray-500 bg-[#3f3f3f] fixed top-[${cords.top}] left-[${cords.left}]`}
    >
      {/* //todo: menu buttons -->  */}
      <MenuBtn forCopy={true} forOpen={false} forDelete={false} />
      <MenuBtn forCopy={false} forOpen={true} forDelete={false} />
      <MenuBtn forCopy={false} forOpen={false} forDelete={true} />
    </div>
  );
};

export default Menu;
