import { useState, useEffect, useRef } from "react";

export const useDropdown = (items, options = {}) => {
  const { singleSelect = false } = options;
  const [input, setInput] = useState("");
  const [filteredItems, setFilteredItems] = useState(items || []);
  const [selectedItems, setSelectedItems] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [matchedItem, setMatchedItem] = useState(null);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);

  const resetSelection = () => setSelectedItems([]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInput(value);
    if (value) {
      const filtered = items.filter(
        (item) =>
          item.name.toLowerCase().includes(value.toLowerCase()) &&
          !selectedItems.some((selected) => selected._id === item._id)
      );
      setFilteredItems(filtered);
      setMatchedItem(filtered[0] || null);
    } else {
      setFilteredItems(items.filter((item) => !selectedItems.includes(item)));
      setMatchedItem(null);
    }
  };

  const handleSelectItem = (item) => {
    if (singleSelect) setSelectedItems([item]);
    else if (!selectedItems.find((selected) => selected._id === item._id))
      setSelectedItems((prev) => [...prev, item]);
    setInput("");
    setShowDropdown(false);
    setMatchedItem(null);
    inputRef.current?.blur();
  };

  const handleRemoveItem = (itemToRemove) =>
    setSelectedItems((prev) =>
      prev.filter((item) => item._id !== itemToRemove._id)
    );

  const handleFocus = () => {
    setShowDropdown(true);
    setFilteredItems(
      items.filter(
        (item) => !selectedItems.some((selected) => selected._id === item._id)
      )
    );
  };

  const handleOutsideClick = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target))
      setShowDropdown(false);
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  return {
    input,
    filteredItems,
    selectedItems,
    showDropdown,
    matchedItem,
    setShowDropdown,
    handleInputChange,
    handleSelectItem,
    handleRemoveItem,
    handleFocus,
    inputRef,
    dropdownRef,
    resetSelection,
  };
};
