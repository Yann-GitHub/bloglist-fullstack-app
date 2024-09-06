import { render, screen } from "@testing-library/react";
import Blog from "./Blog";
import userEvent from "@testing-library/user-event";
import { test } from "vitest";

test("renders title of the blog - getByText", () => {
  const blog = {
    title: "Component testing is done with react-testing-library",
    author: "M. Mustonen",
    url: "https://reacttestinglibrary.com/",
    likes: 7,
  };

  render(<Blog blog={blog} />);

  const element = screen.getByText(
    "Component testing is done with react-testing-library"
  );
});

test("renders author of the blog - getByText", () => {
  const blog = {
    title: "Component testing 2",
    author: "Momo",
    url: "https://reacttestinglibrary.com/",
    likes: 7,
  };

  render(<Blog blog={blog} />);

  const element = screen.getByText("Momo");
});

test("not renders url and likes by default - querySelector", () => {
  const blog = {
    title: "Component testing 3",
    author: "Momo",
    url: "https://reacttestinglibrary.com/",
    likes: 7,
  };

  const container = render(<Blog blog={blog} />).container;

  const div = container.querySelector(".blog__info");
  expect(div).toHaveClass("blog__info hidden");
});

test("renders url and likes when view button is clicked", async () => {
  const blog = {
    title: "Component testing 4",
    author: "Momo",
    url: "https://reacttestinglibrary.com/",
    likes: 7,
  };

  const component = render(<Blog blog={blog} />);
  const button = component.getByText("view");
  await userEvent.click(button);

  const div = component.container.querySelector(".blog__info");
  expect(div).not.toHaveClass("blog__info hidden");
});

// test("clicking the like button twice calls event handler twice", async () => {
//   const blog = {
//     title: "Component testing 5",
//     author: "Momo",
//     url: "https://reacttestinglibrary.com/",
//     likes: 7,
//   };

//   const handleLike = vi.fn();

//   const component = render(<Blog blog={blog} />);
//   const button = component.getByText("like");
//   await userEvent.click(button);
//   await userEvent.click(button);

//   expect(handleLike).toHaveBeenCalledTimes(2);
// });
