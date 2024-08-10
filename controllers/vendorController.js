import Medicine from "../models/medicine/medicine.model.js";
import Vendor from "../models/vendor/vendor.model.js";
import jwt from "jsonwebtoken";

export const authenticate = async (req, res, next) => {
  try {
    const vendor = new Vendor(req.body);
    await vendor.save();
    const token = jwt.sign({ id: vendor._id }, process.env.JWT_SECRET);

    res.status(200).json({ vendor, token });
  } catch (error) {
    next(error);
  }
};
export const addMedicine = async (req, res, next) => {
  const { name, brand, category, price, stockQuantity } = req.body;
  try {
    // Check if the medicine already exists
    let medicine = await Medicine.findOne({
      name: name,
      brand: brand,
      category: category,
    });

    // If not, create a new one
    if (!medicine) {
      medicine = new Medicine({ ...req.body });
      await medicine.save();
    }

    // Prepare product details
    const productDetails = {
      name,
      price,
      stockQuantity,
      medicineRef: medicine._id,
      vendorRef: req.user.id,
    };

    // Add product details to the medicine's vendors array
    medicine.stockQuantity+=stockQuantity; // increment stock quantity

    medicine.vendors.push(productDetails);
    await medicine.save();

    // Find the vendor and add the product details
    const vendor = await Vendor.findById(req.user.id);
    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }
    vendor.products.push(productDetails);
    await vendor.save();

    // Respond with the updated medicine
    res.status(200).json(medicine);
  } catch (error) {
    next(error);
  }
};
